import { NextRequest, NextResponse } from 'next/server';
import { uploadMedia, listMedia, deleteMedia } from '@/lib/supabase';

export async function GET() {
  try {
    const files = await listMedia();
    return NextResponse.json(files);
  } catch {
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json({ error: 'No fileName provided' }, { status: 400 });
    }
    const success = await deleteMedia(fileName);
    if (!success) {
      return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename: timestamp prefix to avoid collisions
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}_${safeName}`;

    console.log('Upload attempt:', { fileName, type: file.type, size: buffer.length });
    console.log('Supabase URL configured:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Service key configured:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    const result = await uploadMedia(buffer, fileName, file.type);

    if (!result) {
      return NextResponse.json({ error: 'Upload failed - check server logs' }, { status: 500 });
    }

    return NextResponse.json({
      name: fileName,
      url: result.url,
      path: result.path,
      size: buffer.length,
      contentType: file.type,
    });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
