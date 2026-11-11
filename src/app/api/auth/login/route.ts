import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword, createSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan kata sandi wajib diisi" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const users = await db.findByField<Record<string, unknown>>("Users", "email", cleanEmail);

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: "Email atau kata sandi tidak cocok" },
        { status: 401 }
      );
    }

    const user = users[0];

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Akun Anda sedang dinonaktifkan. Silakan hubungi admin." },
        { status: 403 }
      );
    }

    const passwordMatches = await comparePassword(
      String(password),
      String(user.password_hash)
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { success: false, error: "Email atau kata sandi tidak cocok" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: String(user.id),
      name: String(user.name),
      email: String(user.email),
      role: String(user.role_id),
      status: String(user.status),
    };

    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      message: "Berhasil masuk",
      user: sessionUser,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pada server saat login" },
      { status: 500 }
    );
  }
}

