"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Metrics {
  usersCount: number;
  rolesCount: number;
  newsCount: number;
}

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    usersCount: 0,
    rolesCount: 0,
    newsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [usersRes, rolesRes, newsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/roles"),
          fetch("/api/admin/news"),
        ]);

        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();
        const newsData = await newsRes.json();

        setMetrics({
          usersCount: usersData.data?.length || 0,
          rolesCount: rolesData.data?.length || 0,
          newsCount: newsData.data?.length || 0,
        });
      } catch (err) {
        console.error("Gagal memuat metrik:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#FFEDB9] via-[#feebdb] to-[#fda057]/40 p-6 sm:p-8 rounded-3xl border border-[#EED8A1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#934b03] uppercase tracking-wider">
            Sistem Manajemen Terintegrasi
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231a10] mt-1">
            Selamat Datang di Panel Gorengan HN
          </h2>
          <p className="text-xs sm:text-sm text-[#7A6451] mt-1 max-w-xl">
            Semua data pengguna, role akses, dan publikasi warta kuliner terhubung langsung dengan Google Spreadsheet sebagai basis data.
          </p>
        </div>

        <Link
          href="/dashboard/news"
          className="inline-flex items-center gap-2 bg-[#ffcb56] text-[#423223] font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-sm hover:bg-[#fda057] transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tulis Berita Baru</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1]/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#7A6451]">Total Pengguna</span>
            <div className="text-3xl font-extrabold text-[#231a10] mt-1">
              {loading ? "..." : metrics.usersCount}
            </div>
            <Link href="/dashboard/users" className="text-xs font-bold text-[#934b03] mt-2 inline-block hover:underline">
              Kelola Pengguna →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#FFEDB9] flex items-center justify-center text-[#934b03]">
            <span className="material-symbols-outlined text-3xl">group</span>
          </div>
        </div>

        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1]/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#7A6451]">Role Terdaftar</span>
            <div className="text-3xl font-extrabold text-[#231a10] mt-1">
              {loading ? "..." : metrics.rolesCount}
            </div>
            <Link href="/dashboard/roles" className="text-xs font-bold text-[#934b03] mt-2 inline-block hover:underline">
              Kelola Role →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#ffdf9f] flex items-center justify-center text-[#795900]">
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>
        </div>

        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1]/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#7A6451]">Artikel Berita</span>
            <div className="text-3xl font-extrabold text-[#231a10] mt-1">
              {loading ? "..." : metrics.newsCount}
            </div>
            <Link href="/dashboard/news" className="text-xs font-bold text-[#934b03] mt-2 inline-block hover:underline">
              Kelola Berita →
            </Link>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#ffdcc5] flex items-center justify-center text-[#934b03]">
            <span className="material-symbols-outlined text-3xl">feed</span>
          </div>
        </div>
      </div>

      {/* Security & Setup Advisory Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1] shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-[#934b03] font-bold text-sm">
            <span className="material-symbols-outlined text-xl">shield</span>
            <span>Peringatan Keamanan Kredensial</span>
          </div>
          <p className="text-xs text-[#7A6451] leading-relaxed">
            Akun admin awal dibuat dengan sandi bawaan (<code className="bg-[#feebdb] px-1.5 py-0.5 rounded text-[#231a10] font-mono">123456</code>). Sangat disarankan untuk segera mengganti kata sandi admin sebelum proyek ini dipublikasikan secara daring ke Vercel di Step 4.
          </p>
        </div>

        <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1] shadow-xs space-y-3">
          <div className="flex items-center gap-2.5 text-[#795900] font-bold text-sm">
            <span className="material-symbols-outlined text-xl">cloud_sync</span>
            <span>Integrasi Google Spreadsheet</span>
          </div>
          <p className="text-xs text-[#7A6451] leading-relaxed">
            File skrip <code className="bg-[#feebdb] px-1.5 py-0.5 rounded text-[#231a10] font-mono">code.gs</code> dan <code className="bg-[#feebdb] px-1.5 py-0.5 rounded text-[#231a10] font-mono">setup.gs</code> telah disiapkan di root proyek. Panduan lengkap penyambungan database tersedia di file <code className="bg-[#feebdb] px-1.5 py-0.5 rounded text-[#231a10] font-mono">/documentation/SETUP.md</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

