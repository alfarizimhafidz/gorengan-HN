"use client";

import { useEffect, useState } from "react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role_id: string;
  status: string;
  created_at: string;
}

interface RoleItem {
  id: string;
  name: string;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const [uRes, rRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
      ]);
      const uData = await uRes.json();
      const rData = await rRes.json();
      if (uData.success) setUsers(uData.data);
      if (rData.success) setRoles(rData.data);
    } catch {
      setAlertMsg({ type: "error", text: "Gagal memuat daftar pengguna" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role_id: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Role pengguna berhasil diubah" });
        fetchUsers();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal mengubah role" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan koneksi" });
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: `Status pengguna berhasil diubah menjadi ${nextStatus}` });
        fetchUsers();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal memperbarui status" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan koneksi" });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Pengguna berhasil dihapus" });
        fetchUsers();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Gagal menghapus pengguna" });
      }
    } catch {
      setAlertMsg({ type: "error", text: "Terjadi kesalahan koneksi" });
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#231a10]">Manajemen Pengguna</h2>
          <p className="text-xs text-[#7A6451] mt-0.5">
            Kelola hak akses role dan keaktifan akun terdaftar pada sistem
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFFDF9] border border-[#EED8A1] px-4 py-2.5 pl-10 rounded-2xl text-xs text-[#231a10] focus:outline-none focus:ring-2 focus:ring-[#fda057]"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#7A6451]">
            search
          </span>
        </div>
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

      {/* Users Table */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-[#EED8A1]/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#feebdb]/50 border-b border-[#EED8A1] text-[#423223]">
                <th className="py-3.5 px-6 font-bold">Nama Pengguna</th>
                <th className="py-3.5 px-6 font-bold">Email</th>
                <th className="py-3.5 px-6 font-bold">Role Akses</th>
                <th className="py-3.5 px-6 font-bold">Status</th>
                <th className="py-3.5 px-6 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#feebdb]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7A6451]">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7A6451]">
                    Tidak ada data pengguna yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#fff8f4] transition-colors">
                    <td className="py-4 px-6 font-semibold text-[#231a10]">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 text-[#7A6451]">{user.email}</td>
                    <td className="py-4 px-6">
                      <select
                        value={user.role_id}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="bg-[#feebdb]/40 border border-[#EED8A1] rounded-xl px-2.5 py-1 text-xs font-bold text-[#423223] focus:outline-none focus:ring-1 focus:ring-[#fda057]"
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.name}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                          user.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-600" : "bg-red-600"}`}></span>
                        <span>{user.status === "active" ? "Aktif" : "Nonaktif"}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === "active" ? "Nonaktifkan akun" : "Aktifkan akun"}
                        className="px-3 py-1.5 rounded-xl border border-[#EED8A1] text-xs font-semibold hover:bg-[#FFEDB9] transition-colors text-[#423223]"
                      >
                        {user.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        title="Hapus Pengguna"
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
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
  );
}

