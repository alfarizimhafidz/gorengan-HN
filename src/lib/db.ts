/**
 * GOOGLE SPREADSHEET DATABASE CLIENT
 * Berkomunikasi aman dengan Google Apps Script Web App menggunakan secret token.
 * Dilengkapi fallback lokal otomatis agar dashboard tetap bisa langsung diuji coba
 * sebelum pengguna men-deploy Apps Script miliknya.
 */

export interface DbResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";
const APPS_SCRIPT_SECRET = process.env.APPS_SCRIPT_SECRET || "";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderRecord {
  [key: string]: unknown;
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  items_json: string; // JSON string of OrderItem[]
  total_amount: number;
  notes?: string;
  status: "menunggu_konfirmasi" | "dikonfirmasi" | "dibatalkan";
  created_at: string;
  updated_at: string;
}

// In-Memory Local Mock Database untuk pengujian cepat sebelum Apps Script dihubungkan
interface LocalDatabase {
  Roles: Array<Record<string, unknown>>;
  Users: Array<Record<string, unknown>>;
  News: Array<Record<string, unknown>>;
  Orders: Array<Record<string, unknown>>;
}

const localDb: LocalDatabase = {
  Roles: [
    {
      id: "role-admin",
      name: "admin",
      description: "Akses penuh ke seluruh sistem dan manajemen",
      permissions: "all",
      is_system: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "role-user",
      name: "user",
      description: "Pengguna terdaftar umum",
      permissions: "read:self",
      is_system: true,
      created_at: new Date().toISOString(),
    },
  ],
  Users: [
    {
      id: "user-admin-01",
      name: "Super Admin HN",
      email: "admin@gmail.com",
      // Bcrypt hash dari '123456'
      password_hash: "$2b$10$nn6tsRcF9IOJAtxWkjHGe.b2nEnQNTY4bfHdTGFLVbbrjJ0lXKhoy",
      role_id: "admin",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  News: [
    {
      id: "news-01",
      title: "Rahasia Pisang Goreng Madu Karamel yang Tetap Renyah Hingga 6 Jam",
      slug: "rahasia-pisang-goreng-madu",
      excerpt:
        "Kenali pemilihan pisang raja matang pohon dan teknik karamelisasi madu murni yang menghasilkan tekstur renyah di luar, lembut lumer di dalam.",
      content:
        "Pisang goreng madu merupakan salah satu varian gorengan premium terfavorit. Kuncinya terletak pada kematangan buah pisang raja lokal yang manis alami dipadukan dengan celupan madu hutan asli sebelum digoreng pada suhu stabil 175 derajat celcius.",
      thumbnail_path: "/images/news-pisang-madu.jpg",
      status: "published",
      author_id: "Super Admin HN",
      created_at: "12 Mei 2025",
      updated_at: "12 Mei 2025",
    },
    {
      id: "news-02",
      title: "Gorengan HN Resmikan Gerai Konsep Baru di Jakarta Selatan",
      slug: "gerai-baru-jakarta-selatan",
      excerpt:
        "Hadir dengan suasana kafe modern berpadu sentuhan kayu hangat, pelanggan kini bisa menikmati kopi tubruk sembari ngemil mendoan panas.",
      content:
        "Ekspansi terbaru Gorengan HN di Senopati Jakarta Selatan menawarkan konsep kedai modern ber-AC, koneksi Wi-Fi kencang, dan live frying counter di mana pengunjung dapat menyaksikan kebersihan proses pembuatan secara langsung.",
      thumbnail_path: "/images/news-gerai-senopati.jpg",
      status: "published",
      author_id: "Super Admin HN",
      created_at: "28 April 2025",
      updated_at: "28 April 2025",
    },
    {
      id: "news-03",
      title: "Standar Emas Dapur Bersih: Bagaimana Kami Menjaga Kualitas Minyak Goreng",
      slug: "standar-dapur-bersih",
      excerpt:
        "Transparansi proses produksi dan komitmen uji berkala kualitas minyak demi gorengan yang aman, renyah, dan nyaman di tenggorokan.",
      content:
        "Kami menggunakan alat pengukur TPM (Total Polar Materials) digital untuk memastikan minyak kelapa sawit yang digunakan selalu berada dalam batas aman pangan internasional dan diganti secara teratur setiap pergantian shift.",
      thumbnail_path: "/images/kitchen-hygiene.jpg",
      status: "published",
      author_id: "Super Admin HN",
      created_at: "15 April 2025",
      updated_at: "15 April 2025",
    },
  ],
  Orders: [
    {
      id: "HN-202611-001",
      user_id: "user-admin-01",
      customer_name: "Rizky Pratama (Kantor Mandiri Sudirman)",
      customer_phone: "081298765432",
      delivery_address: "Gedung Plaza Mandiri Lt. 14, Jl. Gatot Subroto No. 36, Jakarta Selatan",
      delivery_date: "12 November 2026",
      delivery_time: "10:30 WIB",
      items_json: JSON.stringify([
        { id: "prod-snackbox-standard", name: "Snack Box Kantor Reguler (Isi 5)", price: 18000, quantity: 20, subtotal: 360000 },
        { id: "prod-pisang-madu", name: "Pisang Goreng Madu Karamel (Porsi 5 Pcs)", price: 20000, quantity: 2, subtotal: 40000 },
      ]),
      total_amount: 400000,
      notes: "Minta sambal kecap dipisah di wadah tersendiri ya.",
      status: "menunggu_konfirmasi",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};

async function callAppsScript<T>(payload: Record<string, unknown>): Promise<DbResponse<T>> {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("...")) {
    // Mode fallback lokal
    return executeLocalFallback<T>(payload);
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        secretToken: APPS_SCRIPT_SECRET,
      }),
      // Jangan cache request ke database
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Apps Script HTTP status: ${response.status}`);
    }

    const data = await response.json();
    return data as DbResponse<T>;
  } catch (error) {
    console.warn("Koneksi ke Apps Script gagal, mengalihkan ke mode lokal:", error);
    return executeLocalFallback<T>(payload);
  }
}

function executeLocalFallback<T>(payload: Record<string, unknown>): DbResponse<T> {
  const table = payload.table as keyof LocalDatabase;
  const action = payload.action as string;

  if (!localDb[table]) {
    return { success: false, error: `Tabel ${table} tidak ditemukan di database` };
  }

  const list = localDb[table];

  if (action === "SELECT_ALL") {
    return { success: true, data: [...list] as unknown as T };
  }

  if (action === "FIND_BY_FIELD") {
    const field = payload.field as string;
    const value = String(payload.value);
    const results = list.filter((item) => String(item[field]) === value);
    return { success: true, data: results as unknown as T };
  }

  if (action === "INSERT") {
    const newRecord = payload.data as Record<string, unknown>;
    list.push(newRecord);
    return { success: true, message: "Data berhasil ditambahkan", data: newRecord as unknown as T };
  }

  if (action === "UPDATE") {
    const id = String(payload.id);
    const updated = payload.data as Record<string, unknown>;
    const idx = list.findIndex((item) => String(item.id) === id);
    if (idx === -1) {
      return { success: false, error: "Data tidak ditemukan" };
    }
    list[idx] = { ...list[idx], ...updated };
    return { success: true, message: "Data berhasil diperbarui" };
  }

  if (action === "DELETE") {
    const id = String(payload.id);
    const idx = list.findIndex((item) => String(item.id) === id);
    if (idx === -1) {
      return { success: false, error: "Data tidak ditemukan" };
    }
    list.splice(idx, 1);
    return { success: true, message: "Data berhasil dihapus" };
  }

  return { success: false, error: `Aksi ${action} tidak didukung` };
}

export const db = {
  async selectAll<T>(table: string): Promise<T[]> {
    const res = await callAppsScript<T[]>({ action: "SELECT_ALL", table });
    return res.data || [];
  },

  async findByField<T>(table: string, field: string, value: string): Promise<T[]> {
    const res = await callAppsScript<T[]>({ action: "FIND_BY_FIELD", table, field, value });
    return res.data || [];
  },

  async insert<T extends Record<string, unknown>>(table: string, data: T): Promise<DbResponse<T>> {
    return callAppsScript<T>({ action: "INSERT", table, data });
  },

  async update(table: string, id: string, data: Record<string, unknown>): Promise<DbResponse> {
    return callAppsScript({ action: "UPDATE", table, id, data });
  },

  async delete(table: string, id: string): Promise<DbResponse> {
    return callAppsScript({ action: "DELETE", table, id });
  },
};

