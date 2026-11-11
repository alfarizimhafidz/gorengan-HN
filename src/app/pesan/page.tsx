"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { menuProducts, MenuProduct } from "@/config/site";

export default function OrderPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("Hari Ini");
  const [deliveryTime, setDeliveryTime] = useState("Segera (30-45 Menit)");
  const [notes, setNotes] = useState("");

  // Cek sesi user saat ini
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json.success && json.data) {
          setCurrentUser(json.data);
          if (json.data.name) setCustomerName(json.data.name);
        }
      } catch {
        // Abaikan bila tidak ada sesi
      }
    }
    checkUser();
  }, []);

  const categories = ["Semua", "Snack Box", "Gorengan Satuan", "Frozen", "Hampers"];

  const filteredProducts =
    selectedCategory === "Semua"
      ? menuProducts
      : menuProducts.filter((p) => p.category === selectedCategory);

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      const updated = { ...prev };
      if (next === 0) {
        delete updated[productId];
      } else {
        updated[productId] = next;
      }
      return updated;
    });
  };

  // Kalkulasi Live Harga
  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = menuProducts.find((p) => p.id === productId)!;
    return {
      product,
      quantity,
      subtotal: product.price * quantity,
    };
  });

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (cartItems.length === 0) {
      setErrorMessage("Silakan pilih minimal 1 menu makanan terlebih dahulu.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      setErrorMessage("Mohon lengkapi nama pemesan, nomor WhatsApp, dan alamat pengantaran.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        notes,
        items: cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setErrorMessage(json.error || "Gagal membuat pesanan. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      // Berhasil -> arahkan ke halaman pembayaran QRIS
      router.push(`/pesanan/${json.data.id}/bayar`);
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi gangguan koneksi. Silakan periksa kembali jaringan Anda.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#231a10]">
      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#EED8A1]/50 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-full bg-[#feebdb] hover:bg-[#FFEDB9] flex items-center justify-center transition-colors text-[#934b03]"
              title="Kembali ke Beranda"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#231a10] tracking-tight">
                Pesan Menu Gorengan HN
              </h1>
              <p className="text-xs text-[#7A6451]">Pilih menu lezat & pantau total harga langsung</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link
                href="/pesanan"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#feebdb] hover:bg-[#FFEDB9] text-xs font-bold text-[#934b03] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                <span className="hidden sm:inline">Pesanan Saya</span>
              </Link>
            ) : (
              <Link
                href="/login?redirect=/pesan"
                className="text-xs font-semibold text-[#934b03] hover:underline"
              >
                Masuk Akun
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Kolom Kiri: Katalog Menu & Pilihan */}
          <section className="lg:col-span-7 space-y-6">
            {/* Filter Kategori */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#934b03] text-white shadow-sm"
                      : "bg-[#feebdb]/50 hover:bg-[#feebdb] text-[#7A6451]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid Daftar Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      qty > 0
                        ? "bg-white border-[#fda057] shadow-md ring-2 ring-[#fda057]/20"
                        : "bg-white border-[#EED8A1]/60 hover:border-[#fda057]/60 shadow-sm"
                    }`}
                  >
                    <div>
                      {/* Gambar & Badge */}
                      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#feebdb]/40 mb-3">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 300px"
                        />
                        {prod.badge && (
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#934b03] text-white shadow-sm">
                            {prod.badge}
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                          {prod.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-[#231a10] leading-snug line-clamp-1">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-[#7A6451] line-clamp-2 mt-1 mb-3">
                        {prod.description}
                      </p>
                    </div>

                    {/* Harga & Kontrol Kuantitas */}
                    <div className="pt-3 border-t border-[#EED8A1]/30 flex items-center justify-between mt-auto">
                      <div>
                        <div className="text-[11px] text-[#7A6451] font-medium">Harga satuan</div>
                        <div className="text-base font-extrabold text-[#934b03]">
                          {formatRupiah(prod.price)}
                          <span className="text-[11px] font-normal text-[#7A6451]"> /{prod.unit}</span>
                        </div>
                      </div>

                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => updateQuantity(prod.id, 1)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#feebdb] hover:bg-[#934b03] text-[#934b03] hover:text-white font-bold text-xs transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                          Tambah
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#feebdb] rounded-xl p-1 border border-[#EED8A1]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(prod.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-100 flex items-center justify-center text-[#934b03] font-bold text-sm shadow-xs transition-colors"
                            aria-label="Kurangi kuantitas"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#231a10]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(prod.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#934b03] hover:bg-[#7b3e02] flex items-center justify-center text-white font-bold text-sm shadow-xs transition-colors"
                            aria-label="Tambah kuantitas"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Kolom Kanan: Keranjang Real-time & Formulir Pengantaran */}
          <aside className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl border border-[#EED8A1] shadow-sm p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#EED8A1]/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#934b03]">shopping_bag</span>
                  <h2 className="font-extrabold text-base text-[#231a10]">Ringkasan Pesanan</h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#feebdb] text-[#934b03] font-bold">
                  {totalItemsCount} Menu
                </span>
              </div>

              {/* Daftar Item Terpilih */}
              <div className="py-4 space-y-3 max-h-56 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#7A6451] space-y-2">
                    <span className="material-symbols-outlined text-3xl text-[#d2c5af]">
                      lunch_dining
                    </span>
                    <p>Belum ada gorengan yang dipilih.</p>
                    <p className="text-[11px] text-[#934b03]">
                      Klik tombol <b>+ Tambah</b> pada menu di samping.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-[#EED8A1]/20 last:border-none"
                    >
                      <div className="flex-1 pr-3">
                        <div className="font-bold text-[#231a10]">{item.product.name}</div>
                        <div className="text-[#7A6451]">
                          {item.quantity} × {formatRupiah(item.product.price)}
                        </div>
                      </div>
                      <div className="font-extrabold text-[#934b03]">
                        {formatRupiah(item.subtotal)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Rincian Subtotal & Total Live */}
              <div className="pt-4 border-t border-[#EED8A1]/50 space-y-2">
                <div className="flex justify-between text-xs text-[#7A6451]">
                  <span>Subtotal Makanan</span>
                  <span className="font-semibold text-[#231a10]">{formatRupiah(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7A6451]">
                  <span>Biaya Ongkir Area Kebayoran / Jakarta</span>
                  <span className="font-semibold text-emerald-600">Gratis (Promo HN)</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#231a10] pt-2 border-t border-dashed border-[#EED8A1]">
                  <span>Total yang Harus Dibayar</span>
                  <span className="text-xl text-[#934b03]">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Form Data Pengantaran */}
              <form onSubmit={handleSubmitOrder} className="mt-6 space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#231a10] mb-1">
                    Nama Pemesan / Kantor *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Dimas Prakoso (PT Jaya)"
                    className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-3.5 py-2.5 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#231a10] mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Contoh: 081298765432"
                    className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-3.5 py-2.5 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#231a10] mb-1">
                    Alamat Lengkap Pengiriman *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Jalan, nomor gedung/lantai, patokan lokasi..."
                    className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-3.5 py-2.5 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#231a10] mb-1">
                      Tanggal Antar
                    </label>
                    <select
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-3 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                    >
                      <option value="Hari Ini">Hari Ini</option>
                      <option value="Besok">Besok</option>
                      <option value="Lusa">Lusa</option>
                      <option value="Jadwal Khusus Acara">Jadwal Khusus Acara</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#231a10] mb-1">
                      Waktu Pengantaran
                    </label>
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-3 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                    >
                      <option value="Segera (30-45 Menit)">Segera (30-45 Mnt)</option>
                      <option value="09:00 - 11:00 WIB (Pagi)">09:00 - 11:00 (Pagi)</option>
                      <option value="11:30 - 13:30 WIB (Makan Siang)">11:30 - 13:30 (Siang)</option>
                      <option value="15:00 - 17:00 WIB (Coffee Break)">15:00 - 17:00 (Sore)</option>
                      <option value="18:30 - 20:30 WIB (Malam)">18:30 - 20:30 (Malam)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#231a10] mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Cabai rawit dipisah, boks dilabeli nama"
                    className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-3.5 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-[#934b03] hover:bg-[#7b3e02] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Memproses Pesanan...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">qr_code_2</span>
                      Lanjut ke Pembayaran QRIS ({formatRupiah(totalAmount)})
                    </>
                  )}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
