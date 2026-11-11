"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
        setLoading(false);
        return;
      }

      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (data.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch {
      setErrorMsg("Koneksi gagal. Pastikan jaringan Anda stabil.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f4] via-[#feebdb]/50 to-[#fff8f4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#EED8A1] shadow-sm">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-xl text-[#231a10] tracking-tight">
              {siteConfig.name}
            </span>
            <span className="text-[10px] tracking-widest text-[#934b03] font-bold uppercase">
              {siteConfig.subtitle}
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-[#231a10]">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-xs text-[#7A6451]">
          Kelola pesanan, nikmati promo spesial, atau akses dashboard admin
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-lg rounded-3xl border border-[#EED8A1]/80 space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#231a10] mb-1" htmlFor="email">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2.5 rounded-xl text-sm text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                placeholder="admin@gmail.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#231a10] mb-1" htmlFor="password">
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2.5 rounded-xl text-sm text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                placeholder="••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#ffcb56] text-[#423223] font-extrabold text-sm shadow-sm hover:bg-[#fda057] transition-all disabled:opacity-50"
            >
              {loading ? "Memverifikasi..." : "Masuk"}
            </button>
          </form>

          <div className="pt-4 border-t border-[#feebdb] text-center text-xs text-[#7A6451]">
            Belum memiliki akun?{" "}
            <Link
              href={redirectUrl ? `/register?redirect=${encodeURIComponent(redirectUrl)}` : "/register"}
              className="font-bold text-[#934b03] hover:underline"
            >
              Daftar sebagai Pengguna
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#7A6451] hover:text-[#231a10] flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fff8f4]" />}>
      <LoginForm />
    </Suspense>
  );
}
