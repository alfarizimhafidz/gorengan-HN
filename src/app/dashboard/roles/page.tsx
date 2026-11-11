"use client";

import { useEffect, useState } from "react";

interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string;
  is_system: boolean;
  created_at: string;
}

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState("read:general");
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      if (data.success) setRoles(data.data);
    } catch {
      setAlertMsg({ type: "error", text: "Gagal memuat daftar role" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setAlertMsg(null);

    try {
      const res = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, permissions }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: `Role "${name}" berhasil ditambahkan` });
        setName("");
        setDescription("");
        fetchRoles();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal membuat role" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan koneksi" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (role: RoleItem) => {
    if (role.is_system) {
      alert("Role sistem bawaan tidak dapat dihapus.");
      return;
    }

    if (!confirm(`Hapus role "${role.name}"? Pengguna dengan role ini perlu disesuaikan kembali.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/roles?id=${role.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Role berhasil dihapus" });
        fetchRoles();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal menghapus role" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan koneksi" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-[#231a10]">Manajemen Role & Hak Akses</h2>
        <p className="text-xs text-[#7A6451] mt-0.5">
          Atur tingkat kewenangan akses pengguna pada sistem Gorengan HN
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

      {/* Grid: Form Tambah Role & Tabel Role */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Tambah */}
        <div className="lg:col-span-5 bg-[#FFFDF9] p-6 rounded-3xl border border-[#EED8A1] shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-xl text-[#934b03]">add_moderator</span>
            <h3 className="font-bold text-base text-[#231a10]">Tambah Role Baru</h3>
          </div>

          <form onSubmit={handleCreateRole} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#423223]">Nama Role</label>
              <input
                type="text"
                required
                placeholder="Contoh: manager, staf_dapur"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#423223]">Deskripsi Peran</label>
              <textarea
                rows={2}
                placeholder="Jelaskan ruang lingkup peran ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#423223]">Tingkat Izin (Permission)</label>
              <select
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
                className="mt-1 w-full bg-[#feebdb]/30 border border-[#EED8A1] px-4 py-2 rounded-xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
              >
                <option value="read:general">Hanya Lihat Data (Read Only)</option>
                <option value="editor:news">Editor Berita & Artikel</option>
                <option value="operator:order">Operator Pesanan & Katering</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#ffcb56] text-[#423223] font-bold text-xs py-2.5 rounded-full hover:bg-[#fda057] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>{submitting ? "Menyimpan..." : "Simpan Role Baru"}</span>
            </button>
          </form>
        </div>

        {/* Tabel Role */}
        <div className="lg:col-span-7 bg-[#FFFDF9] rounded-3xl border border-[#EED8A1]/70 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#feebdb]/50 border-b border-[#EED8A1] text-[#423223]">
                  <th className="py-3 px-5 font-bold">Nama Role</th>
                  <th className="py-3 px-5 font-bold">Deskripsi</th>
                  <th className="py-3 px-5 font-bold">Tipe</th>
                  <th className="py-3 px-5 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#feebdb]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#7A6451]">
                      Memuat daftar role...
                    </td>
                  </tr>
                ) : (
                  roles.map((r) => (
                    <tr key={r.id} className="hover:bg-[#fff8f4] transition-colors">
                      <td className="py-3.5 px-5 font-bold text-[#231a10]">
                        <span className="bg-[#feebdb] px-2 py-0.5 rounded-md font-mono">
                          {r.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-[#7A6451] max-w-xs">{r.description}</td>
                      <td className="py-3.5 px-5">
                        {r.is_system ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#934b03] bg-[#FFEDB9] px-2 py-0.5 rounded-full">
                            <span className="material-symbols-outlined text-[12px]">lock</span>
                            <span>Sistem</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Kustom
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {r.is_system ? (
                          <span className="text-[11px] text-[#7A6451]/60 italic">Bawaan</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteRole(r)}
                            className="px-2.5 py-1 rounded-lg border border-red-200 text-xs text-red-700 hover:bg-red-50"
                          >
                            Hapus
                          </button>
                        )}
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

