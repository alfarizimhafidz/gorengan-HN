import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const roles = await db.selectAll<Record<string, unknown>>("Roles");
  return NextResponse.json({ success: true, data: roles });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Nama role diperlukan" }, { status: 400 });
    }

    const cleanName = String(name).trim().toLowerCase();
    const existing = await db.findByField<Record<string, unknown>>("Roles", "name", cleanName);
    if (existing && existing.length > 0) {
      return NextResponse.json({ success: false, error: "Nama role sudah ada" }, { status: 400 });
    }

    const newRole = {
      id: `role-${crypto.randomUUID().slice(0, 8)}`,
      name: cleanName,
      description: description || "Role kustom",
      permissions: permissions || "read:general",
      is_system: false,
      created_at: new Date().toISOString(),
    };

    const res = await db.insert("Roles", newRole);
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
      return NextResponse.json({ success: false, error: "ID role diperlukan" }, { status: 400 });
    }

    const roles = await db.selectAll<Record<string, unknown>>("Roles");
    const target = roles.find((r) => String(r.id) === String(id));

    if (!target) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan" }, { status: 404 });
    }

    if (target.is_system === true || target.name === "admin" || target.name === "user") {
      return NextResponse.json(
        { success: false, error: "Role bawaan sistem tidak boleh dihapus." },
        { status: 400 }
      );
    }

    const res = await db.delete("Roles", id);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

