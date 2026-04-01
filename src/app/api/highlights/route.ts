import { NextResponse } from "next/server";
import { getHighlights, createHighlight } from "@/lib/db";

export async function GET() {
  try {
    const highlights = await getHighlights();
    return NextResponse.json(highlights);
  } catch {
    return NextResponse.json({ error: "Failed to fetch highlights" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const highlight = await createHighlight(data);
    return NextResponse.json(highlight);
  } catch {
    return NextResponse.json({ error: "Failed to create highlight" }, { status: 500 });
  }
}