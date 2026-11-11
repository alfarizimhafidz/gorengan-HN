"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderRecord, OrderItem } from "@/lib/db";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

function PaymentContent() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setOrder(json.data);
        } else {
          setError(json.error || "Pesanan tidak ditemukan");
        }
      } catch {
        setError("Gagal memuat detail pesanan");
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleCopyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-[#934b03] animate-spin">
            progress_activity
          </span>
          <p className="text-sm font-semibold text-[#7A6451]">Memuat rincian pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#EED8A1] text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-red-500">error</span>
          <h2 className="text-lg font-bold text-[#231a10]">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-[#7A6451]">{error || "ID pesanan tidak valid atau sudah kadaluarsa."}</p>
          <Link
            href="/pesan"
            className="inline-block px-6 py-2.5 rounded-full bg-[#934b03] text-white text-xs font-bold hover:bg-[#7b3e02] transition-colors"
          >
            Kembali Buat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  let items: OrderItem[] = [];
  try {
    items = JSON.parse(order.items_json);
  } catch {
    items = [];
  }

  // Siapkan tautan WhatsApp admin
  const waMessage = encodeURIComponent(
    `Halo Admin ${siteConfig.name}, saya sudah transfer/scan QRIS untuk pesanan *${order.id}* atas nama *${order.customer_name}* sebesar *${formatRupiah(order.total_amount)}*. Mohon dibantu konfirmasi ya. Terima kasih!`
  );
  const waUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#231a10] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/pesan"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#934b03] hover:underline"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Pesan Menu Lain
          </Link>
          <Link
            href="/pesanan"
            className="text-xs font-semibold text-[#7A6451] hover:text-[#231a10]"
          >
            Lihat Semua Pesanan Saya →
          </Link>
        </div>

        {/* Card Utama Pembayaran */}
        <div className="bg-white rounded-3xl border border-[#EED8A1] shadow-md overflow-hidden">
          {/* Header Banner Status */}
          <div className="bg-[#feebdb] px-6 py-4 border-b border-[#EED8A1] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#7A6451] uppercase tracking-wider">
                Tiket Pesanan
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-extrabold text-[#231a10] font-mono">{order.id}</span>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="p-1 hover:bg-white rounded-md text-[#934b03] transition-colors"
                  title="Salin ID Pesanan"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold ${
                  order.status === "dikonfirmasi"
                    ? "bg-emerald-100 text-emerald-800"
                    : order.status === "dibatalkan"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-900 animate-pulse"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {order.status === "dikonfirmasi"
                  ? "Pembayaran Dikonfirmasi"
                  : order.status === "dibatalkan"
                  ? "Dibatalkan"
                  : "Menunggu Konfirmasi Pembayaran"}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Box Barcode QRIS */}
            <div className="flex flex-col items-center text-center space-y-4 bg-[#FFFDF9] p-6 rounded-2xl border border-[#EED8A1]">
              <div className="text-xs font-bold text-[#7A6451]">
                Scan QRIS dengan Bank / E-Wallet Apa Saja
              </div>

              {/* Tampilan QRIS */}
              <div className="relative w-64 h-80 bg-white rounded-xl shadow-sm border border-neutral-200 p-2 flex items-center justify-center">
                <Image
                  src="/images/qris-hn.svg"
                  alt="QRIS Gorengan HN"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              <div className="w-full bg-[#feebdb] py-2 px-3 rounded-xl border border-[#EED8A1]">
                <div className="text-[11px] text-[#7A6451]">Total yang Harus Di-Scan / Ditransfer:</div>
                <div className="text-xl font-extrabold text-[#934b03]">
                  {formatRupiah(order.total_amount)}
                </div>
              </div>
            </div>

            {/* Rincian Pesanan & Petunjuk */}
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-[#231a10] mb-2">Rincian Pengantaran</h3>
                <div className="text-xs space-y-1.5 bg-[#feebdb]/30 p-3.5 rounded-xl border border-[#EED8A1]/50">
                  <div className="flex justify-between">
                    <span className="text-[#7A6451]">Pemesan:</span>
                    <span className="font-bold text-[#231a10]">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6451]">WhatsApp:</span>
                    <span className="font-semibold text-[#231a10]">{order.customer_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A6451]">Jadwal:</span>
                    <span className="font-semibold text-[#231a10]">
                      {order.delivery_date} • {order.delivery_time}
                    </span>
                  </div>
                  <div className="pt-1 text-[#7A6451]">
                    Alamat: <span className="text-[#231a10] font-medium">{order.delivery_address}</span>
                  </div>
                  {order.notes && (
                    <div className="pt-1 text-[#934b03] italic">
                      Catatan: &ldquo;{order.notes}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Daftar Menu Dipesan */}
              <div>
                <h3 className="text-sm font-extrabold text-[#231a10] mb-2">Menu yang Dipesan</h3>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-xs py-1 border-b border-[#EED8A1]/30 last:border-none"
                    >
                      <span>
                        {item.name} <b className="text-[#934b03]">× {item.quantity}</b>
                      </span>
                      <span className="font-bold">{formatRupiah(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tombol Aksi WhatsApp */}
              <div className="space-y-2 pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  Konfirmasi Pembayaran via WhatsApp
                </a>
                <p className="text-[11px] text-center text-[#7A6451]">
                  Setelah transfer/scan, admin kami akan segera memverifikasi dan menyiapkan pesanan hangat Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#934b03] animate-spin">
              progress_activity
            </span>
            <p className="text-sm font-semibold text-[#7A6451]">Memuat rincian pembayaran...</p>
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
