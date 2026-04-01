import { NextResponse } from "next/server";
import { getHighlight, updateHighlight, deleteHighlight } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const highlight = await getHighlight(Number(id));
  return NextResponse.json(highlight);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const updated = await updateHighlight(Number(id), data);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteHighlight(Number(id));
  return NextResponse.json({ success: true });
}
