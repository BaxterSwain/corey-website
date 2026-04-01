import { NextResponse } from "next/server";
import { getContent, updateContent } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    if (!section) {
      return NextResponse.json({ error: "Missing section" }, { status: 400 });
    }

    const content = await getContent(section);

    return NextResponse.json(content);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { section, key, value } = await req.json();

    await updateContent(section, key, value);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}