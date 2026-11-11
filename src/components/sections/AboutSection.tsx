import Image from "next/image";
import { siteConfig, strengths } from "@/config/site";

export default function AboutSection() {
  const yearsServing = siteConfig.yearsServing;

  return (
    <section id="tentang-kami" className="w-full bg-[#fff1e7]/50 py-20 lg:py-28 border-y border-[#EED8A1]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Hygiene & Counter Display */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-xl bg-[#231a10] border-2 border-[#EED8A1]/40 relative min-h-[480px] h-[520px] group">
              <Image
                src="/images/kitchen-hygiene.jpg"
                alt="Chef Gorengan HN memasak di dapur terbuka bersih profesional"
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-700"
              />
              
              {/* Overlay Gradient Content at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#231a10] via-[#231a10]/40 to-transparent flex flex-col justify-end p-7 text-[#FFFDF9]">
                <div className="flex items-center gap-2 self-start bg-[#FFEDB9]/25 backdrop-blur-sm px-3.5 py-1 rounded-full border border-[#FFEDB9]/40 mb-2">
                  <span className="material-symbols-outlined text-[16px] text-[#ffcb56]">verified_user</span>
                  <span className="text-[11px] font-bold text-[#FFEDB9] uppercase tracking-wider">
                    Dapur Terbuka Terstandarisasi
                  </span>
                </div>
                <h4 className="text-xl font-bold tracking-tight text-[#FFFDF9]">
                  Higienitas Dapur Tanpa Kompromi
                </h4>
                <p className="text-xs text-[#FFFDF9]/85 mt-1.5 leading-relaxed">
                  Setiap koki tersertifikasi sanitasi pangan demi sajian yang aman, higienis, dan sehat untuk keluarga Anda.
                </p>
              </div>

            </div>

            {/* Float Overlay Counter Badge */}
            <div className="absolute -top-6 -right-3 sm:-right-6 flex flex-col bg-[#FFFDF9] p-5 rounded-2xl shadow-2xl border border-[#EED8A1] max-w-[210px] z-20">
              <span className="text-4xl font-extrabold text-[#934b03] leading-none">
                {yearsServing}+
              </span>
              <span className="text-sm font-bold text-[#231a10] mt-1.5">
                Tahun Melayani Nusantara
              </span>
              <span className="text-xs text-[#7A6451] mt-0.5">
                Sejak {siteConfig.since} di Jakarta
              </span>
            </div>

          </div>

          {/* Right Column: Story & 3 Pillars */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#934b03]">
                TENTANG GORENGAN HN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231a10] mt-2 tracking-tight">
                Dedikasi Merawat Kelezatan Tradisi dengan Standar Modern
              </h2>
            </div>

            <p className="text-base text-[#7A6451] leading-relaxed">
              Berawal dari kedai sederhana pada tahun {siteConfig.since}, {siteConfig.name} hadir merevolusi cara masyarakat menikmati kudapan gorengan. Kami membuktikan bahwa gorengan jalanan bisa dinikmati dengan kelas rasa istimewa, higienitas dapur terbuka berstandar resto, serta cita rasa gurih yang autentik tanpa bahan pengawet sintetik.
            </p>

            {/* 3 Pillars of Quality */}
            <div className="grid grid-cols-1 gap-4 pt-2">
              {strengths.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFDF9] border border-[#EED8A1]/60 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass} ${item.iconColor}`}>
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-[#231a10]">{item.title}</h3>
                    <p className="text-sm text-[#7A6451] mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
