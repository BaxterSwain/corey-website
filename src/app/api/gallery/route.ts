import { NextResponse } from "next/server";
import { getGallery, createGalleryItem } from "@/lib/db";

export async function GET() {
  const gallery = await getGallery();
  return NextResponse.json(gallery);
}

export async function POST(req: Request) {
  const data = await req.json();
  const item = await createGalleryItem(data);
  return NextResponse.json(item);
}