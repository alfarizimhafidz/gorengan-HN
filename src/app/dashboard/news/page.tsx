"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_path: string;
  status: "published" | "draft" | string;
  created_at: string;
}

export default function NewsManagementPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (data.success) setNewsList(data.data);
    } catch {
      setAlertMsg({ type: "error", text: "Gagal memuat daftar berita" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertMsg(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("status", status);
      if (file) {
        formData.append("thumbnail", file);
      }

      const res = await fetch("/api/admin/news", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Artikel berita berhasil diterbitkan!" });
        setTitle("");
        setExcerpt("");
        setContent("");
        setFile(null);
        setPreviewUrl(null);
        fetchNews();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal menerbitkan berita" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan saat mengunggah berita" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: NewsItem) => {
    const nextStatus = item.status === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/admin/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: `Status artikel diubah menjadi ${nextStatus}` });
        fetchNews();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal memperbarui status" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan koneksi" });
    }
  };

  const handleDeleteNews = async (id: string, itemTitle: string) => {
    if (!confirm(`Hapus artikel "${itemTitle}"? Foto thumbnail lokal terkait juga akan dibersihkan.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Artikel berhasil dihapus" });
        fetchNews();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal menghapus artikel" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan koneksi" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-[#231a10]">CRUD Berita & Artikel Kuliner</h2>
        <p className="text-xs text-[#7A6451] mt-0.5">
          Tulis dan kelola warta edukasi yang tayang langsung di halaman utama Gorengan HN
        </p>
      </div>

      {alertMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
            alertMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <span>{alertMsg.text}</span>
          <button onClick={() => setAlertMsg(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Grid: Form Tulis Berita & Tabel List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tulis Berita */}
        <div className="lg:col-span-5 bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1] shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-xl text-[#934b03]">post_add</span>
            <h3 className="font-bold text-base text-[#231a10]">Tambah Artikel Baru</h3>
          </div>

          <form onSubmit={handleCreateNews} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#423223]">Judul Artikel</label>
              <input
                type="text"
                required
                placeholder="Contoh: Manfaat Tahu Sumedang Organik..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#423223]">Cuplikan Singkat (Excerpt)</label>
              <textarea
                rows={2}
                required
                placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="mt-1 w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#423223]">Isi Konten Lengkap</label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan isi artikel selengkapnya di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#423223]">Status Publikasi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
              >
                <option value="published">Tayangkan Langsung (Published)</option>
                <option value="draft">Simpan sebagai Draf (Draft)</option>
              </select>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-xs font-bold text-[#423223]">Upload Foto Thumbnail</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="mt-1 w-full text-xs text-[#7A6451] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#FFEDB9] file:text-[#423223] hover:file:bg-[#ffcb56]"
              />
              <p className="mt-1 text-[10px] text-[#7A6451]">
                Maksimal 5MB. Format: JPG, PNG, WebP. Tersimpan di folder lokal <code className="font-mono">public/uploads/</code>.
              </p>

              {previewUrl && (
                <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden border border-[#EED8A1]">
                  <Image src={previewUrl} alt="Pratinjau" fill className="object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#ffcb56] text-[#423223] font-bold text-xs py-3 rounded-full hover:bg-[#fda057] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">publish</span>
              <span>{submitting ? "Mengunggah..." : "Terbitkan Berita"}</span>
            </button>
          </form>
        </div>

        {/* Tabel Berita */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#EED8A1]/70 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#feebdb] flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#231a10]">Daftar Berita ({newsList.length})</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#feebdb]/50 border-b border-[#EED8A1] text-[#423223]">
                  <th className="py-3 px-4 font-bold">Thumbnail</th>
                  <th className="py-3 px-4 font-bold">Judul & Tanggal</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#feebdb]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#7A6451]">
                      Memuat artikel...
                    </td>
                  </tr>
                ) : newsList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#7A6451]">
                      Belum ada artikel berita.
                    </td>
                  </tr>
                ) : (
                  newsList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fff8f4] transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden border border-[#EED8A1] bg-[#231a10]">
                          {item.thumbnail_path && (
                            <Image
                              src={item.thumbnail_path}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#231a10] line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-[#7A6451] mt-0.5">{item.created_at}</div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title="Klik untuk ubah status"
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase transition-transform active:scale-95 ${
                            item.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === "published" ? "bg-emerald-600" : "bg-amber-600"}`}></span>
                          <span>{item.status}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteNews(item.id, item.title)}
                          className="px-2.5 py-1 rounded-lg border border-red-200 text-xs text-red-700 hover:bg-red-50"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

