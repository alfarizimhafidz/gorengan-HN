"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { newsArticles as defaultArticles } from "@/config/site";

interface ArticleItem {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  category?: string;
  thumbnail_path?: string;
  image?: string | null;
  created_at?: string;
  date?: string;
}

export default function NewsSection() {
  const [articles, setArticles] = useState<ArticleItem[]>(defaultArticles);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map((item: Record<string, unknown>, idx: number) => ({
            id: item.id || idx,
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt,
            category: "Kabar HN",
            thumbnail_path: item.thumbnail_path || "/images/news-pisang-madu.jpg",
            image: item.thumbnail_path || "/images/news-pisang-madu.jpg",
            created_at: item.created_at || "Terbaru",
            date: item.created_at || "Terbaru",
          }));
          setArticles(mapped);
        }
      })
      .catch(() => {
        // Tetap gunakan default jika fetch gagal
      });
  }, []);

  return (
    <section id="berita" className="w-full bg-[#fff1e7]/40 py-20 lg:py-28 border-y border-[#EED8A1]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#934b03]">
            KABAR & EDUKASI KULINER
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231a10] mt-2 tracking-tight">
            Cerita dari Dapur Gorengan HN
          </h2>
          <p className="text-base text-[#7A6451] mt-3 leading-relaxed">
            Temukan wawasan resep nusantara, liputan kegiatan gerai, dan komitmen kami menjaga kualitas sajian gorengan setiap harinya.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 6).map((article) => {
            const imgSource = article.thumbnail_path || article.image || "/images/news-pisang-madu.jpg";
            const dateDisplay = article.created_at || article.date || "Terbaru";
            const categoryDisplay = article.category || "Tips Kuliner";

            return (
              <article
                key={article.id}
                className="bg-[#FFFDF9] rounded-3xl overflow-hidden border border-[#EED8A1]/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] bg-[#231a10] overflow-hidden">
                  <Image
                    src={imgSource}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-10 bg-[#423223]/85 text-[#FFFDF9] backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                    {categoryDisplay}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#7A6451]">
                      {dateDisplay} • {categoryDisplay}
                    </span>
                    <h3 className="text-xl font-bold text-[#231a10] mt-2 leading-snug group-hover:text-[#934b03] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[#7A6451] mt-3 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#feebdb]">
                    <Link
                      href={`#berita-${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#934b03] group-hover:gap-2.5 transition-all"
                    >
                      <span>Baca Selengkapnya</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-14 flex justify-center">
          <Link
            href="#berita"
            className="inline-flex items-center gap-2 bg-[#FFFDF9] text-[#423223] font-bold text-sm px-8 py-3.5 rounded-full border border-[#EED8A1] shadow-xs hover:bg-[#FFEDB9] transition-all hover:scale-105"
          >
            <span>Lihat Semua Berita & Promo ({articles.length})</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
