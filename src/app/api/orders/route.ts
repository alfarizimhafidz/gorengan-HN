import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, OrderRecord } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Silakan login terlebih dahulu untuk melihat pesanan Anda." },
        { status: 401 }
      );
    }

    // Ambil pesanan milik user
    let orders: OrderRecord[] = [];
    try {
      const allOrders = await db.selectAll<OrderRecord>("Orders");
      orders = allOrders.filter((o) => o.user_id === user.id);
    } catch {
      orders = [];
    }

    // Urutkan dari yang paling baru
    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Gagal mengambil pesanan user:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      delivery_address,
      delivery_date,
      delivery_time,
      items,
      notes,
    } = body;

    // Validasi Input
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ success: false, error: "Nama pemesan wajib diisi" }, { status: 400 });
    }

    if (!customer_phone || !customer_phone.trim()) {
      return NextResponse.json({ success: false, error: "Nomor WhatsApp wajib diisi" }, { status: 400 });
    }

    // Validasi format nomor HP Indonesia (minimal 9 digit, diawali 08 atau 62)
    const phoneClean = customer_phone.replace(/[\s-]/g, "");
    if (!/^(\+?62|08)[0-9]{8,13}$/.test(phoneClean)) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp tidak valid (contoh: 081234567890)" },
        { status: 400 }
      );
    }

    if (!delivery_address || !delivery_address.trim()) {
      return NextResponse.json({ success: false, error: "Alamat pengantaran wajib diisi" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "Pilih minimal 1 menu makanan" }, { status: 400 });
    }

    // Hitung total harga di server untuk keamanan
    let total_amount = 0;
    const sanitizedItems = items.map((item: { id: string; name: string; price: number; quantity: number }) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = Math.max(0, Number(item.price) || 0);
      const subtotal = qty * price;
      total_amount += subtotal;
      return {
        id: String(item.id),
        name: String(item.name),
        price,
        quantity: qty,
        subtotal,
      };
    });

    if (total_amount <= 0) {
      return NextResponse.json({ success: false, error: "Total pesanan tidak valid" }, { status: 400 });
    }

    // Generate Order ID Unik (contoh: HN-2611-X489)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `HN-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    const newOrder: OrderRecord = {
      id: orderId,
      user_id: user ? user.id : `guest-${randomSuffix}`,
      customer_name: customer_name.trim(),
      customer_phone: phoneClean,
      delivery_address: delivery_address.trim(),
      delivery_date: delivery_date || "Hari ini",
      delivery_time: delivery_time || "Segera",
      items_json: JSON.stringify(sanitizedItems),
      total_amount,
      notes: notes ? notes.trim() : "",
      status: "menunggu_konfirmasi",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const res = await db.insert<OrderRecord>("Orders", newOrder);
    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error || "Gagal menyimpan pesanan" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibuat",
      data: newOrder,
    });
  } catch (error) {
    console.error("Gagal membuat pesanan:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
