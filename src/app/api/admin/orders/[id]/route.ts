import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak: Hanya admin" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    const validStatuses = ["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Status pesanan tidak valid" }, { status: 400 });
    }

    const res = await db.update("Orders", id, {
      status,
      updated_at: new Date().toISOString(),
    });

    if (!res.success) {
      return NextResponse.json({ success: false, error: res.error || "Gagal memperbarui status" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Status pesanan berhasil diubah menjadi ${status}` });
  } catch (error) {
    console.error("Gagal update status pesanan:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
