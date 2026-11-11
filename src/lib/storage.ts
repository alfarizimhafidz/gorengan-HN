import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export interface StorageResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Menyimpan file media ke folder lokal public/uploads/
 * Catatan Arsitektur:
 * Pada lingkungan Vercel production, filesystem bersifat read-only / stateless.
 * Modul ini diisolasi agar siap digantikan oleh cloud storage (Vercel Blob / S3) di Step 4.
 */
export async function saveFile(file: File): Promise<StorageResult> {
  try {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Hanya menerima JPG, PNG, dan WebP.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal 5 MB.",
      };
    }

    // Pastikan folder uploads ada
    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Dapatkan ekstensi dari nama file asli
    const ext = path.extname(file.name) || ".jpg";
    const uniqueFileName = `${crypto.randomUUID()}${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueFileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(destinationPath, buffer);

    return {
      success: true,
      filePath: `/uploads/${uniqueFileName}`,
    };
  } catch (error) {
    console.error("Gagal menyimpan file:", error);
    return {
      success: false,
      error: "Gagal menyimpan file ke penyimpanan lokal.",
    };
  }
}

/**
 * Menghapus file media dari folder public/uploads/
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    if (!filePath || !filePath.startsWith("/uploads/")) {
      return false;
    }

    const fileName = path.basename(filePath);
    const fullPath = path.join(UPLOAD_DIR, fileName);

    await fs.unlink(fullPath);
    return true;
  } catch {
    // Abaikan jika file memang sudah tidak ada
    return false;
  }
}

