import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi minimal 6 karakter" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await db.findByField<Record<string, unknown>>("Users", "email", cleanEmail);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(String(password));
    const newUserId = `user-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toISOString();

    const newUserRecord = {
      id: newUserId,
      name: String(name).trim(),
      email: cleanEmail,
      password_hash: hashedPassword,
      role_id: "user", // Default register selalu role user biasa
      status: "active",
      created_at: now,
      updated_at: now,
    };

    await db.insert("Users", newUserRecord);

    const sessionUser = {
      id: newUserId,
      name: newUserRecord.name,
      email: cleanEmail,
      role: "user",
      status: "active",
    };

    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      user: sessionUser,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server saat registrasi" },
      { status: 500 }
    );
  }
}

