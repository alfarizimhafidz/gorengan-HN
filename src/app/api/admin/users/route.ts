import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const users = await db.selectAll<Record<string, unknown>>("Users");
  const sanitized = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role_id: u.role_id,
    status: u.status,
    created_at: u.created_at,
    updated_at: u.updated_at,
  }));

  return NextResponse.json({ success: true, data: sanitized });
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, role_id, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID pengguna diperlukan" }, { status: 400 });
    }

    // Cegah admin menonaktifkan dirinya sendiri
    if (String(id) === String(currentUser.id) && status === "inactive") {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menonaktifkan akun admin Anda sendiri." },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (role_id) updateData.role_id = role_id;
    if (status) updateData.status = status;

    const res = await db.update("Users", id, updateData);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID diperlukan" }, { status: 400 });
    }

    // Cegah admin menghapus dirinya sendiri
    if (String(id) === String(currentUser.id)) {
      return NextResponse.json(
        { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." },
        { status: 400 }
      );
    }

    const allUsers = await db.selectAll<Record<string, unknown>>("Users");
    const adminCount = allUsers.filter((u) => u.role_id === "admin").length;
    const targetUser = allUsers.find((u) => String(u.id) === String(id));

    if (targetUser && targetUser.role_id === "admin" && adminCount <= 1) {
      return NextResponse.json(
        { success: false, error: "Tidak dapat menghapus admin terakhir pada sistem." },
        { status: 400 }
      );
    }

    const res = await db.delete("Users", id);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

