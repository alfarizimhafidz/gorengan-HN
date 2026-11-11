"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full bg-[#231a10] text-[#fff8f4] pt-16 pb-12 border-t border-[#EED8A1]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#EED8A1]">
                <Image
                  src={siteConfig.logo}
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-[#FFFDF9] tracking-tight">
                  {siteConfig.name}
                </span>
                <span className="text-[10px] tracking-widest text-[#fda057] font-bold uppercase">
                  {siteConfig.tagline}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#d2c5af] leading-relaxed max-w-sm">
              Sajian gorengan premium kontemporer bercita rasa autentik Nusantara. Menghadirkan kerenyahan higienis, bumbu rempah pilihan, dan kenyamanan santap berkelas modern sejak {siteConfig.since}.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-[#FFEDB9] border border-white/15">
                100% Halal Certified
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-[#FFEDB9] border border-white/15">
                Food Safety Grade A
              </span>
            </div>
          </div>

          {/* Col 2: Nav Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#fda057]">
              Jelajahi
            </h5>
            <ul className="flex flex-col gap-2 text-xs text-[#d2c5af]">
              <li><Link href="#beranda" className="hover:text-[#FFFDF9] transition-colors">Beranda</Link></li>
              <li><Link href="#tentang-kami" className="hover:text-[#FFFDF9] transition-colors">Tentang Kami</Link></li>
              <li><Link href="#layanan" className="hover:text-[#FFFDF9] transition-colors">Layanan Katering</Link></li>
              <li><Link href="#berita" className="hover:text-[#FFFDF9] transition-colors">Berita & Artikel</Link></li>
              <li><Link href="#kontak" className="hover:text-[#FFFDF9] transition-colors">Kontak & Lokasi</Link></li>
            </ul>
          </div>

          {/* Col 3: Hours & Service */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#fda057]">
              Jam Operasional
            </h5>
            <div className="flex flex-col gap-1.5 text-xs text-[#d2c5af]">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Senin - Jumat</span>
                <span className="font-semibold text-[#FFFDF9]">10.00 - 21.00 WIB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span>Sabtu - Minggu</span>
                <span className="font-semibold text-[#FFFDF9]">09.00 - 22.00 WIB</span>
              </div>
              <div className="pt-2 text-[11px] text-[#fda057] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                <span>Pesanan katering 24 jam dibuka</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-[#fda057]">
              Warta & Promo
            </h5>
            <p className="text-xs text-[#d2c5af]">
              Dapatkan penawaran menu musiman dan diskon katering langsung di email Anda.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Terima kasih sudah berlangganan warta promo Gorengan HN!"); }} className="flex gap-2 mt-1">
              <input
                type="email"
                required
                placeholder="Alamat email Anda"
                className="bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-[#FFFDF9] placeholder-[#d2c5af]/60 focus:outline-none focus:ring-1 focus:ring-[#fda057] w-full"
              />
              <button
                type="submit"
                aria-label="Kirim langganan"
                className="bg-[#ffcb56] text-[#423223] px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-[#fda057] transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
            <span className="text-[10px] text-[#d2c5af]/60">Bebas spam. Berhenti berlangganan kapan saja.</span>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#d2c5af]/70">
          <p>© 2026 {siteConfig.name}. Cita Rasa Nusantara Otentik. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#FFFDF9] transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-[#FFFDF9] transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-[#FFFDF9] transition-colors">Sertifikasi Halal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
