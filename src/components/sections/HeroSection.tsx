import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function HeroSection() {
  return (
    <section id="beranda" className="relative w-full overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-[#fff8f4] via-[#fff1e7]/40 to-[#fff8f4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-[#FFEDB9] text-[#423223] border border-[#EED8A1] shadow-xs">
              <span className="text-xs font-bold tracking-wider uppercase">
                ✨ {siteConfig.shortDescription}
              </span>
            </div>

            {/* Bold Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#231a10] tracking-tight leading-[1.15]">
              Gorengan Hangat,{" "}
              <span className="text-[#934b03] inline-block">Renyah Sempurna</span>,{" "}
              Warisan Resep Asli Nusantara.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-[#7A6451] max-w-2xl leading-relaxed">
              {siteConfig.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/pesan"
                className="inline-flex items-center justify-center gap-2 bg-[#ffcb56] text-[#423223] font-bold text-base px-8 py-3.5 rounded-full shadow-[0_8px_24px_rgba(255,203,86,0.35)] hover:bg-[#fda057] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Pesan Sekarang & Cek Harga</span>
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              </Link>
              <Link
                href="#kontak"
                className="inline-flex items-center justify-center gap-2 bg-[#FFFDF9] text-[#423223] font-bold text-base px-7 py-3.5 rounded-full border border-[#EED8A1] shadow-xs hover:bg-[#FFEDB9] transition-all"
              >
                <span>Kunjungi Gerai Kami</span>
                <span className="material-symbols-outlined text-[18px]">storefront</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3 bg-[#ffffff]/90 px-4 py-2.5 rounded-2xl border border-[#EED8A1]/50 shadow-xs">
                <div className="flex text-[#795900]">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#231a10]">4.9 / 5.0</span>
                  <span className="text-[11px] font-semibold text-[#7A6451] uppercase tracking-wider">15.000+ Pelanggan Puas</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#ffffff]/90 px-4 py-2.5 rounded-2xl border border-[#EED8A1]/50 shadow-xs">
                <span className="material-symbols-outlined text-[#934b03] text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#231a10]">100% Halal LPPOM</span>
                  <span className="text-[11px] font-semibold text-[#7A6451] uppercase tracking-wider">Minyak Selalu Baru & Tersaring</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Visual Platter */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#ffcb56]/30 to-[#fda057]/20 rounded-3xl blur-2xl -z-10"></div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EED8A1]/60 bg-[#231a10] min-h-[440px] h-[460px] group">
              <Image
                src="/images/hero-platter.jpg"
                alt="Platter Gorengan HN Aneka Bakwan Tempe Tahu Isi"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 z-10 bg-[#FFFDF9]/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-md border border-[#EED8A1] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#934b03] animate-pulse"></span>
                <span className="text-xs font-bold text-[#423223]">Goreng Dadakan Panas</span>
              </div>

              {/* Floating Bottom Badge */}
              <div className="absolute bottom-4 right-4 z-10 bg-[#423223]/90 text-[#FFFDF9] backdrop-blur-md px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#ffcb56]">local_fire_department</span>
                <span className="text-xs font-semibold">Sambal Kecap Rawit Khas HN</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
