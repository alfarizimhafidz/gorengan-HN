import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allNews = await db.selectAll<Record<string, unknown>>("News");
    // Filter hanya yang berstatus published untuk konsumsi landing page
    const publishedNews = allNews.filter((n) => n.status === "published");
    return NextResponse.json({ success: true, data: publishedNews });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

