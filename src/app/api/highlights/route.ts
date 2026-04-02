import { NextResponse, NextRequest } from "next/server";
import { getHighlights, createHighlight } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const highlights = await getHighlights();
    return NextResponse.json(highlights);
  } catch {
    return NextResponse.json({ error: "Failed to fetch highlights" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const highlight = await createHighlight({
      title: body.title,
      subtitle: body.subtitle,
      duration: body.duration,
      views: body.views,
      videoUrl: body.videoUrl,
      badge: body.badge,
      badgeColor: body.badgeColor,
      gradient: body.gradient,
      featured: body.featured,
      gallery_id: body.galleryId || null
    });
    return NextResponse.json(highlight);
  } catch {
    return NextResponse.json({ error: "Failed to create highlight" }, { status: 500 });
  }
}