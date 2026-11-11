"use client";

import React, { useEffect, useState } from "react";
import { OrderRecord, OrderItem } from "@/lib/db";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
      } else {
        setError(json.error || "Gagal memuat daftar pesanan");
      }
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan"
  ) => {
    const confirmText =
      newStatus === "dikonfirmasi"
        ? "Konfirmasi bahwa pembayaran pesanan ini telah diterima?"
        : "Batalkan pesanan ini?";

    if (!window.confirm(confirmText)) return;

    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord.id === id ? { ...ord, status: newStatus } : ord))
        );
      } else {
        alert(json.error || "Gagal memperbarui status");
      }
    } catch {
      alert("Terjadi kesalahan saat memperbarui status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Metrics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === "menunggu_konfirmasi").length;
  const confirmedOrdersCount = orders.filter((o) => o.status === "dikonfirmasi").length;
  const totalRevenue = orders
    .filter((o) => o.status === "dikonfirmasi")
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  // Filter
  const filteredOrders = orders.filter((o) => {
    const matchesTab =
      activeTab === "semua" ? true : o.status === activeTab;
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#231a10] tracking-tight">
            Manajemen Pesanan Masuk
          </h1>
          <p className="text-xs text-[#7A6451] mt-0.5">
            Verifikasi bukti pembayaran QRIS dan pantau pengiriman pesanan katering & gorengan
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#EED8A1] text-xs font-bold text-[#7A6451] hover:text-[#231a10] hover:bg-[#feebdb]/40 shadow-xs transition-colors self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Muat Ulang
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#EED8A1] shadow-xs">
          <div className="text-[11px] font-bold text-[#7A6451] uppercase">Total Pesanan</div>
          <div className="text-2xl font-extrabold text-[#231a10] mt-1">{totalOrdersCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            Menunggu Verifikasi
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">{pendingOrdersCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 shadow-xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase">Dikonfirmasi</div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">{confirmedOrdersCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#EED8A1] shadow-xs">
          <div className="text-[11px] font-bold text-[#7A6451] uppercase">Omset Masuk</div>
          <div className="text-lg sm:text-xl font-extrabold text-[#934b03] mt-1">
            {formatRupiah(totalRevenue)}
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "semua", label: `Semua (${totalOrdersCount})` },
            { id: "menunggu_konfirmasi", label: `Perlu Konfirmasi (${pendingOrdersCount})` },
            { id: "dikonfirmasi", label: `Dikonfirmasi (${confirmedOrdersCount})` },
            { id: "dibatalkan", label: "Dibatalkan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#934b03] text-white shadow-xs"
                  : "bg-white hover:bg-[#feebdb]/50 text-[#7A6451] border border-[#EED8A1]/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#7A6451]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID tiket, nama, nomor WA..."
            className="w-full sm:w-64 bg-white border border-[#EED8A1] pl-9 pr-3 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EED8A1]">
          <span className="material-symbols-outlined text-4xl text-[#934b03] animate-spin">
            progress_activity
          </span>
          <p className="text-xs font-semibold text-[#7A6451] mt-2">Memuat data pesanan...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-[#EED8A1] space-y-2">
          <span className="material-symbols-outlined text-4xl text-[#d2c5af]">inbox</span>
          <p className="text-xs font-bold text-[#231a10]">Tidak ada pesanan ditemukan</p>
          <p className="text-[11px] text-[#7A6451]">Pesanan baru dari pembeli akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            let items: OrderItem[] = [];
            try {
              items = JSON.parse(ord.items_json);
            } catch {
              items = [];
            }

            // URL WhatsApp ke pembeli
            const cleanPhone = ord.customer_phone.startsWith("0")
              ? "62" + ord.customer_phone.slice(1)
              : ord.customer_phone.replace("+", "");

            const waMsg = encodeURIComponent(
              `Halo Kak *${ord.customer_name}*, kami dari Gorengan HN ingin mengonfirmasi pesanan tiket *${ord.id}* dengan total *${formatRupiah(ord.total_amount)}*.`
            );
            const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-[#EED8A1] shadow-xs overflow-hidden transition-all hover:border-[#fda057]"
              >
                {/* Header bar */}
                <div className="bg-[#feebdb]/50 px-5 py-3 border-b border-[#EED8A1]/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-xs text-[#231a10]">
                      {ord.id}
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

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold ${
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
                </div>

                {/* Content Body */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Info Pemesan & Pengantaran */}
                  <div className="md:col-span-5 space-y-2 text-xs border-b md:border-b-0 md:border-r border-[#EED8A1]/40 pb-4 md:pb-0 md:pr-4">
                    <div className="flex justify-between">
                      <span className="text-[#7A6451]">Nama Pemesan:</span>
                      <span className="font-bold text-[#231a10]">{ord.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6451]">Nomor WhatsApp:</span>
                      <span className="font-semibold text-[#231a10] font-mono">
                        {ord.customer_phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6451]">Jadwal Antar:</span>
                      <span className="font-semibold text-[#934b03]">
                        {ord.delivery_date} • {ord.delivery_time}
                      </span>
                    </div>
                    <div className="pt-1 text-[#7A6451]">
                      Alamat:{" "}
                      <span className="text-[#231a10] font-medium block mt-0.5">
                        {ord.delivery_address}
                      </span>
                    </div>
                    {ord.notes && (
                      <div className="p-2 rounded-lg bg-[#feebdb]/50 border border-[#EED8A1]/50 text-[#934b03] italic text-[11px]">
                        Catatan: &ldquo;{ord.notes}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Rincian Menu Dipesan */}
                  <div className="md:col-span-4 space-y-2 text-xs">
                    <div className="font-bold text-[#7A6451] text-[11px] uppercase">
                      Rincian Menu ({items.length} Macam):
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-[#231a10]">
                          <span className="line-clamp-1">
                            {it.name} <b className="text-[#934b03]">× {it.quantity}</b>
                          </span>
                          <span className="font-bold">{formatRupiah(it.subtotal)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-[#EED8A1]/40 flex justify-between items-center">
                      <span className="font-bold text-[#7A6451]">Total Tagihan:</span>
                      <span className="text-base font-extrabold text-[#934b03]">
                        {formatRupiah(ord.total_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Aksi Admin */}
                  <div className="md:col-span-3 flex flex-col justify-center gap-2 pt-2 md:pt-0">
                    {/* Tombol WA Langsung */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Hubungi via WhatsApp
                    </a>

                    {/* Tombol Konfirmasi jika status belum dikonfirmasi */}
                    {ord.status !== "dikonfirmasi" && (
                      <button
                        type="button"
                        disabled={updatingId === ord.id}
                        onClick={() => handleUpdateStatus(ord.id, "dikonfirmasi")}
                        className="w-full py-2 px-3 rounded-xl bg-[#934b03] hover:bg-[#7b3e02] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Konfirmasi Pembayaran
                      </button>
                    )}

                    {/* Tombol Batalkan */}
                    {ord.status !== "dibatalkan" && (
                      <button
                        type="button"
                        disabled={updatingId === ord.id}
                        onClick={() => handleUpdateStatus(ord.id, "dibatalkan")}
                        className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        Tolak / Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
