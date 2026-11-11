"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    purpose: "katering",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    // WhatsApp direct fallback
    const text = `Halo Gorengan HN, saya ${formData.name} (${formData.contact}).\nKeperluan: ${formData.purpose}\nPesan: ${formData.message}`;
    const waUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <section id="kontak" className="w-full bg-[#fff8f4] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#934b03]">
            LOKASI & KONTAK
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231a10] mt-2 tracking-tight">
            Hubungi Kami atau Singgah ke Gerai Utama
          </h2>
          <p className="text-base text-[#7A6451] mt-3 leading-relaxed">
            Konsultasikan pesanan katering instan Anda atau nikmati langsung sajian gorengan hangat di gerai kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Contact Info & Form */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* 4 Info Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EED8A1]/60 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDB9] flex items-center justify-center text-[#934b03] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#7A6451] uppercase">Alamat Utama</span>
                  <span className="text-xs font-semibold text-[#231a10] mt-0.5 leading-snug">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EED8A1]/60 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffdf9f] flex items-center justify-center text-[#795900] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#7A6451] uppercase">WhatsApp / Telp</span>
                  <span className="text-xs font-semibold text-[#231a10] mt-0.5">
                    {siteConfig.contact.phone}
                  </span>
                  <span className="text-[11px] text-[#7A6451]">
                    {siteConfig.contact.phoneLandline}
                  </span>
                </div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EED8A1]/60 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffc4c2] flex items-center justify-center text-[#a43a3d] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#7A6451] uppercase">Email Resmi</span>
                  <span className="text-xs font-semibold text-[#231a10] mt-0.5">
                    {siteConfig.contact.email}
                  </span>
                  <span className="text-[11px] text-[#7A6451]">
                    {siteConfig.contact.emailCatering}
                  </span>
                </div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EED8A1]/60 shadow-xs flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffdcc5] flex items-center justify-center text-[#934b03] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#7A6451] uppercase">Jam Operasional</span>
                  <span className="text-xs font-semibold text-[#231a10] mt-0.5">
                    {siteConfig.contact.days}
                  </span>
                  <span className="text-[11px] text-[#7A6451]">
                    {siteConfig.contact.hours} (Fresh tiap 15 mnt)
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#FFFDF9] p-7 rounded-3xl border border-[#EED8A1]/70 shadow-md">
              <h3 className="text-xl font-bold text-[#231a10]">
                Kirim Pesan & Permintaan Katering
              </h3>
              <p className="text-xs text-[#7A6451] mt-1">
                Tim layanan kami akan merespons dalam waktu maksimal 15 menit.
              </p>

              {formSubmitted ? (
                <div className="mt-6 p-4 rounded-2xl bg-[#FFEDB9]/70 border border-[#EED8A1] text-center">
                  <span className="material-symbols-outlined text-4xl text-[#934b03]">check_circle</span>
                  <h4 className="font-bold text-sm text-[#231a10] mt-2">Pesan Berhasil Terkirim!</h4>
                  <p className="text-xs text-[#7A6451] mt-1">
                    Halaman WhatsApp telah dibuka untuk menghubungkan Anda langsung dengan admin {siteConfig.name}.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-3 text-xs font-bold text-[#934b03] underline"
                  >
                    Kirim pesan baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-[#423223]">
                        Nama Lengkap
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="Contoh: Dimas Prakoso"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2.5 rounded-xl text-sm text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact" className="text-xs font-bold text-[#423223]">
                        Nomor WhatsApp / Email
                      </label>
                      <input
                        id="contact"
                        type="text"
                        required
                        placeholder="0812xxxxxxx"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2.5 rounded-xl text-sm text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="purpose" className="text-xs font-bold text-[#423223]">
                      Pilihan Keperluan
                    </label>
                    <select
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2.5 rounded-xl text-sm text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
                    >
                      <option value="Pemesanan Katering Acara / Kantor (Snack Box)">
                        Pemesanan Katering Acara / Kantor (Snack Box)
                      </option>
                      <option value="Live Cooking Wedding & Booth Festival">
                        Live Cooking Wedding & Booth Festival
                      </option>
                      <option value="Kemitraan Franchise / Reseller">
                        Kemitraan Franchise / Reseller
                      </option>
                      <option value="Pemesanan Paket Frozen">
                        Pemesanan Paket Frozen
                      </option>
                      <option value="Pertanyaan Umum & Saran">
                        Pertanyaan Umum & Saran
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-[#423223]">
                      Pesan Anda
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      required
                      placeholder="Sampaikan estimasi porsi, tanggal acara, atau pertanyaan Anda..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2.5 rounded-xl text-sm text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ffcb56] text-[#423223] font-bold text-sm py-3 rounded-full hover:bg-[#fda057] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Kirim Pesan Sekarang</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Google Maps Embed Card */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1]/70 shadow-md flex flex-col h-full">
              
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-[#feebdb] mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ffdf9f] flex items-center justify-center text-[#795900]">
                    <span className="material-symbols-outlined text-2xl">map</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#231a10]">Peta Lokasi Gerai</h4>
                    <p className="text-xs text-[#7A6451]">{siteConfig.contact.addressShort}</p>
                  </div>
                </div>

                <a
                  href={siteConfig.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#FFEDB9] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#423223] hover:bg-[#ffcb56] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">directions</span>
                  <span>Petunjuk Arah</span>
                </a>
              </div>

              {/* Map Iframe */}
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#EED8A1] bg-[#feebdb]/30">
                <iframe
                  title="Lokasi Gorengan HN"
                  src={siteConfig.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Store Amenities Badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-2 text-center">
                <div className="bg-[#fff1e7] py-2 px-1 rounded-xl border border-[#EED8A1]/50">
                  <span className="text-[11px] font-bold text-[#423223] block">Area Parkir Luas</span>
                </div>
                <div className="bg-[#fff1e7] py-2 px-1 rounded-xl border border-[#EED8A1]/50">
                  <span className="text-[11px] font-bold text-[#423223] block">AC & Wi-Fi Cepat</span>
                </div>
                <div className="bg-[#fff1e7] py-2 px-1 rounded-xl border border-[#EED8A1]/50">
                  <span className="text-[11px] font-bold text-[#423223] block">Dine-in Nyaman</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

