import { NextResponse } from "next/server";
import { getGallery, createGalleryItem } from "@/lib/db";

export async function GET() {
  try {
    const gallery = await getGallery();
    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Creating gallery item with data:', data);
    const item = await createGalleryItem(data);
    console.log('Gallery item created:', item);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ error: 'Failed to create gallery item', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}