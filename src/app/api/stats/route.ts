import { NextResponse } from "next/server";
import { getStats, createStat, updateStat, deleteStat } from "@/lib/db";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const stat = await createStat(data);
    return NextResponse.json(stat);
  } catch {
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    const stat = await updateStat(id, updates);
    return NextResponse.json(stat);
  } catch {
    return NextResponse.json({ error: "Failed to update stat" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await deleteStat(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete stat" }, { status: 500 });
  }
}