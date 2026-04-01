import { NextResponse } from "next/server";
import { updateGalleryItem, deleteGalleryItem } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const updated = await updateGalleryItem(Number(id), data);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteGalleryItem(Number(id));
  return NextResponse.json({ success: true });
}
