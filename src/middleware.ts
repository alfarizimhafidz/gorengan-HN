import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "gorengan_hn_super_secret_jwt_key_2026";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "hn_session_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lindungi seluruh rute dashboard admin
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      
      // Validasi role di server: hanya admin yang berhak mengakses dashboard
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
      }

      return NextResponse.next();
    } catch {
      // Token tidak valid atau kadaluarsa
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Jika sudah login sebagai admin dan membuka /login atau /register, arahkan langsung ke dashboard
  if (pathname === "/login" || pathname === "/register") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        // Abaikan jika token tidak valid
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

