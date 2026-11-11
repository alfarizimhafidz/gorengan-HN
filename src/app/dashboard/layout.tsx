"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setAdminName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const menuItems = [
    { label: "Ringkasan", href: "/dashboard", icon: "dashboard" },
    { label: "Pesanan Masuk", href: "/dashboard/orders", icon: "shopping_bag" },
    { label: "Manajemen User", href: "/dashboard/users", icon: "group" },
    { label: "Manajemen Role", href: "/dashboard/roles", icon: "admin_panel_settings" },
    { label: "CRUD Berita", href: "/dashboard/news", icon: "feed" },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f4] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#FFFDF9] border-r border-[#EED8A1] shrink-0 justify-between">
        <div>
          {/* Brand Logo Header */}
          <div className="h-20 px-6 flex items-center gap-3 border-b border-[#EED8A1]/50">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#EED8A1]">
              <Image src={siteConfig.logo} alt={siteConfig.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base text-[#231a10] leading-none">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-bold text-[#934b03] uppercase mt-1">
                Panel Admin
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#ffcb56] text-[#423223] shadow-xs"
                      : "text-[#7A6451] hover:bg-[#FFEDB9]/50 hover:text-[#231a10]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#EED8A1]/50 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7A6451] hover:bg-[#FFEDB9]/40 hover:text-[#231a10] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>Buka Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#FFFDF9]/80 backdrop-blur-md border-b border-[#EED8A1] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#231a10] hover:bg-[#feebdb]"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
            <h1 className="text-base sm:text-lg font-extrabold text-[#231a10]">
              Dashboard Administrasi
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-[#FFEDB9]/60 px-3.5 py-1.5 rounded-full border border-[#EED8A1]">
              <span className="material-symbols-outlined text-[18px] text-[#934b03]">account_circle</span>
              <span className="text-xs font-bold text-[#423223]">{adminName}</span>
              <span className="text-[10px] font-extrabold text-white bg-[#934b03] px-1.5 py-0.5 rounded-full uppercase">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF9] border-b border-[#EED8A1] p-4 space-y-1 shadow-lg">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#423223] hover:bg-[#FFEDB9]"
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-[#feebdb] flex justify-between">
              <Link href="/" className="text-xs font-semibold text-[#7A6451]">Buka Website</Link>
              <button onClick={handleLogout} className="text-xs font-bold text-red-600">Keluar</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}

