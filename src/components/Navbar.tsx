"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig, navItems } from "@/config/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#fff8f4]/85 backdrop-blur-md border-b border-[#EED8A1]/40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/#beranda" className="flex items-center gap-3 shrink-0">
          <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm bg-neutral-900 border border-[#EED8A1]">
            <Image
              src={siteConfig.logo}
              alt={siteConfig.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight text-[#231a10] tracking-tight">
              {siteConfig.name}
            </span>
            <span className="text-[10px] tracking-widest text-[#934b03] font-bold uppercase">
              {siteConfig.subtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className="px-4 py-2 rounded-full text-sm font-semibold text-[#4e4635] hover:text-[#231a10] hover:bg-[#FFEDB9]/60 transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {/* Menu Pesanan Anda (Hanya jika sudah login) */}
          {user && (
            <Link
              href="/pesanan"
              className="px-4 py-2 rounded-full text-sm font-bold text-[#934b03] bg-[#feebdb] hover:bg-[#FFEDB9] transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Pesanan Anda</span>
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/pesan"
            className="inline-flex items-center gap-1.5 bg-[#ffcb56] text-[#423223] font-bold text-sm px-5 py-2.5 rounded-full shadow-sm hover:bg-[#fda057] transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>Pesan Online</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 bg-[#231a10] text-white text-xs font-bold px-3.5 py-2 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Dashboard</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-semibold text-[#7A6451] hover:text-red-600 px-2 py-1"
                title="Keluar"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-[#231a10] font-semibold text-sm px-3 py-2 rounded-full hover:text-[#934b03] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">account_circle</span>
              <span>Masuk</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Buka menu navigasi"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-xl text-[#231a10] hover:bg-[#feebdb] transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#FFFDF9] border-b border-[#EED8A1] px-6 py-6 flex flex-col gap-3 shadow-xl animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              onClick={() => setIsOpen(false)}
              className="py-2.5 text-base font-semibold text-[#4e4635] hover:text-[#934b03] border-b border-[#feebdb]"
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <Link
              href="/pesanan"
              onClick={() => setIsOpen(false)}
              className="py-2.5 text-base font-bold text-[#934b03] flex items-center gap-2 border-b border-[#feebdb]"
            >
              <span className="material-symbols-outlined text-lg">receipt_long</span>
              <span>Pesanan Anda</span>
            </Link>
          )}

          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              href="/pesan"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#ffcb56] text-[#423223] font-bold text-center py-3 rounded-full shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>Pesan Online (Cek Harga Langsung)</span>
            </Link>

            {user ? (
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-[#231a10]">Halo, {user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 border border-[#EED8A1] text-[#231a10] font-semibold text-center py-2.5 rounded-full"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                <span>Masuk Akun</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
