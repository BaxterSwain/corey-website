import { NextRequest, NextResponse } from 'next/server';
import { deleteMedia } from '@/lib/supabase';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const success = await deleteMedia(name);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
