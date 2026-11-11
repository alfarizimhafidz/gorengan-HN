import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "gorengan_hn_super_secret_jwt_key_2026";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
export const COOKIE_NAME = "hn_session_token";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | string;
  status: "active" | "inactive" | string;
}

/**
 * Hash plain password menggunakan bcrypt
 */
export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

/**
 * Verifikasi plain password dengan hash
 */
export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Buat JWT session token bertanda tangan (kadaluarsa dalam 7 hari)
 */
export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

/**
 * Verifikasi JWT session token
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

/**
 * Dapatkan sesi pengguna aktif dari HTTP cookie
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

