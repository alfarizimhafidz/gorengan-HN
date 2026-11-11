import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveFile, deleteFile } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const news = await db.selectAll<Record<string, unknown>>("News");
  return NextResponse.json({ success: true, data: news });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = (formData.get("status") as string) || "draft";
    const thumbnailFile = formData.get("thumbnail") as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Judul dan konten berita wajib diisi" },
        { status: 400 }
      );
    }

    let thumbnailPath = "/images/news-pisang-madu.jpg"; // Fallback default
    if (thumbnailFile && thumbnailFile.size > 0) {
      const uploadResult = await saveFile(thumbnailFile);
      if (uploadResult.success && uploadResult.filePath) {
        thumbnailPath = uploadResult.filePath;
      } else if (!uploadResult.success) {
        return NextResponse.json({ success: false, error: uploadResult.error }, { status: 400 });
      }
    }

    // Slug URL ramah SEO
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newId = `news-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newsRecord = {
      id: newId,
      title: title.trim(),
      slug: `${slug}-${newId.slice(-4)}`,
      excerpt: excerpt || title.slice(0, 120),
      content: content.trim(),
      thumbnail_path: thumbnailPath,
      status: status,
      author_id: currentUser.name,
      created_at: now,
      updated_at: now,
    };

    const res = await db.insert("News", newsRecord);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, title, excerpt, content, status, thumbnail_path } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita diperlukan" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (status) updateData.status = status;
    if (thumbnail_path) updateData.thumbnail_path = thumbnail_path;

    const res = await db.update("News", id, updateData);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID berita diperlukan" }, { status: 400 });
    }

    // Ambil data untuk membersihkan file lokal jika ada di uploads
    const allNews = await db.selectAll<Record<string, unknown>>("News");
    const target = allNews.find((n) => String(n.id) === String(id));
    if (target && typeof target.thumbnail_path === "string") {
      await deleteFile(target.thumbnail_path);
    }

    const res = await db.delete("News", id);
    return NextResponse.json(res);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

