"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OrderRecord, OrderItem } from "@/lib/db";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.status === 401) {
          router.push("/login?redirect=/pesanan");
          return;
        }

        const json = await res.json();
        if (json.success) {
          setOrders(json.data || []);
        } else {
          setError(json.error || "Gagal memuat pesanan");
        }
      } catch {
        setError("Gagal menghubungi server");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#231a10] py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EED8A1]/60">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="w-8 h-8 rounded-full bg-[#feebdb] hover:bg-[#FFEDB9] flex items-center justify-center text-[#934b03] transition-colors"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
              </Link>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#231a10] tracking-tight">
                Riwayat Pesanan Anda
              </h1>
            </div>
            <p className="text-xs text-[#7A6451] mt-1">
              Pantau status pembayaran & proses pengiriman paket Gorengan HN Anda
            </p>
          </div>

          <Link
            href="/pesan"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#934b03] hover:bg-[#7b3e02] text-white text-xs font-bold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            Pesan Menu Baru
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#934b03] animate-spin">
              progress_activity
            </span>
            <p className="text-xs font-semibold text-[#7A6451]">Memuat daftar pesanan Anda...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EED8A1] p-8 space-y-4">
            <span className="material-symbols-outlined text-5xl text-[#d2c5af]">
              receipt_long
            </span>
            <h2 className="text-base font-bold text-[#231a10]">Belum Ada Pesanan</h2>
            <p className="text-xs text-[#7A6451] max-w-sm mx-auto">
              Anda belum memiliki tiket pesanan aktif. Yuk nikmati aneka gorengan hangat, snack box, dan hampers khas HN!
            </p>
            <Link
              href="/pesan"
              className="inline-block px-6 py-2.5 rounded-full bg-[#934b03] text-white text-xs font-bold hover:bg-[#7b3e02] transition-colors"
            >
              Mulai Pesan Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => {
              let items: OrderItem[] = [];
              try {
                items = JSON.parse(ord.items_json);
              } catch {
                items = [];
              }

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-2xl border border-[#EED8A1] shadow-xs overflow-hidden transition-all hover:shadow-md"
                >
                  {/* Header Bar */}
                  <div className="bg-[#feebdb]/50 px-5 py-3.5 border-b border-[#EED8A1]/40 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-[#231a10]">
                        ID: {ord.id}
                      </span>
                      <span className="text-[11px] text-[#7A6451]">
                        {new Date(ord.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold ${
                        ord.status === "dikonfirmasi"
                          ? "bg-emerald-100 text-emerald-800"
                          : ord.status === "dibatalkan"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {ord.status === "dikonfirmasi"
                        ? "Dikonfirmasi"
                        : ord.status === "dibatalkan"
                        ? "Dibatalkan"
                        : "Menunggu Konfirmasi"}
                    </span>
                  </div>

                  {/* Body Bar */}
                  <div className="p-5 space-y-4">
                    {/* Pesan Sukses Konfirmasi jika status dikonfirmasi */}
                    {ord.status === "dikonfirmasi" && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900">
                        <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">
                          verified
                        </span>
                        <div>
                          <div className="font-bold">Pembayaran Anda Telah Dikonfirmasi!</div>
                          <p className="mt-0.5 text-emerald-800">
                            Selamat, pesanan Anda sedang disiapkan dan akan segera diantarkan sesuai jadwal. Silakan tunggu informasi selanjutnya dari admin melalui WhatsApp.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Rincian Menu */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="md:col-span-2 space-y-1.5">
                        <div className="font-bold text-[#7A6451] text-[11px] uppercase">
                          Menu Dipesan:
                        </div>
                        {items.map((item, idx) => (
                          <div key={idx} className="flex justify-between py-0.5 text-[#231a10]">
                            <span>
                              {item.name} <span className="text-[#934b03] font-bold">× {item.quantity}</span>
                            </span>
                            <span className="font-semibold">{formatRupiah(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#feebdb]/20 p-3 rounded-xl border border-[#EED8A1]/30 space-y-1">
                        <div className="font-bold text-[#7A6451] text-[11px] uppercase">
                          Info Pengantaran:
                        </div>
                        <div className="text-[#231a10] font-semibold">
                          {ord.delivery_date} • {ord.delivery_time}
                        </div>
                        <div className="text-[#7A6451] text-[11px] line-clamp-2">
                          {ord.delivery_address}
                        </div>
                      </div>
                    </div>

                    {/* Footer: Total & CTA */}
                    <div className="pt-3 border-t border-[#EED8A1]/40 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] text-[#7A6451]">Total Pembayaran:</div>
                        <div className="text-base font-extrabold text-[#934b03]">
                          {formatRupiah(ord.total_amount)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/pesanan/${ord.id}/bayar`}
                          className="px-4 py-2 rounded-xl bg-[#feebdb] hover:bg-[#FFEDB9] text-[#934b03] font-bold text-xs transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">qr_code_2</span>
                          Lihat QRIS / Rincian
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
