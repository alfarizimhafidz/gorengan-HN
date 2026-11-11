import { NextRequest, NextResponse } from "next/server";
import { db, OrderRecord } from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID pesanan tidak valid" }, { status: 400 });
    }

    const allOrders = await db.selectAll<OrderRecord>("Orders");
    const order = allOrders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Gagal mengambil detail pesanan:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
