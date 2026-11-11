import { services } from "@/config/site";
import Link from "next/link";

export default function ServicesSection() {
  return (
    <section id="layanan" className="w-full bg-[#fff8f4] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#934b03]">
            LAYANAN KAMI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231a10] mt-2 tracking-tight">
            Pilihan Layanan Fleksibel untuk Segala Kebutuhan Acara
          </h2>
          <p className="text-base text-[#7A6451] mt-3 leading-relaxed">
            Dari cemilan sore keluarga hingga prasmanan event skala besar, kami siap menyajikan kehangatan terbaik dengan kepraktisan maksimal.
          </p>
        </div>

        {/* 6 Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF9] p-7 rounded-3xl border border-[#EED8A1]/70 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="flex flex-col">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${svc.colorClass} ${svc.iconColor} group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-3xl">{svc.icon}</span>
                </div>

                {/* Badge Tag */}
                <span className="inline-flex self-start px-3 py-1 rounded-full bg-[#f8e5d5] text-[#423223] text-xs font-bold mb-3 tracking-wide">
                  {svc.tag}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#231a10] leading-snug group-hover:text-[#934b03] transition-colors">
                  {svc.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#7A6451] mt-2.5 leading-relaxed">
                  {svc.description}
                </p>
              </div>

              {/* Bottom Price & Link */}
              <div className="pt-6 mt-6 border-t border-[#feebdb] flex items-center justify-between">
                <span className="text-xs font-bold text-[#934b03] tracking-wide">
                  {svc.price}
                </span>
                <Link
                  href="/pesan"
                  className="inline-flex items-center gap-1 text-sm font-bold text-[#934b03] group-hover:gap-2 transition-all"
                >
                  <span>Pesan Sekarang</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

