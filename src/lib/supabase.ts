import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-side client with service role key (for admin operations)
// Lazy init to avoid crashing at build time when env vars aren't available
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not configured');
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabaseAdmin;
}

// Storage bucket name
export const MEDIA_BUCKET = 'media';

// Get a public URL for a file in the media bucket
export function getMediaUrl(filePath: string): string {
  if (!supabaseUrl) return '';
  const { data } = getSupabaseAdmin().storage.from(MEDIA_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

// Upload a file to the media bucket
export async function uploadMedia(
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<{ path: string; url: string } | null> {
  const { data, error } = await getSupabaseAdmin().storage
    .from(MEDIA_BUCKET)
    .upload(fileName, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    return null;
  }

  return {
    path: data.path,
    url: getMediaUrl(data.path),
  };
}

// Delete a file from the media bucket
export async function deleteMedia(filePath: string): Promise<boolean> {
  const { error } = await getSupabaseAdmin().storage
    .from(MEDIA_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Supabase delete error:', error);
    return false;
  }
  return true;
}

// List all files in the media bucket
export async function listMedia(): Promise<
  { name: string; url: string; size: number; contentType: string; createdAt: string }[]
> {
  const { data, error } = await getSupabaseAdmin().storage
    .from(MEDIA_BUCKET)
    .list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } });

  if (error) {
    console.error('Supabase list error:', error);
    return [];
  }

  return (data || [])
    .filter((f) => f.name !== '.emptyFolderPlaceholder')
    .map((f) => ({
      name: f.name,
      url: getMediaUrl(f.name),
      size: f.metadata?.size || 0,
      contentType: f.metadata?.mimetype || '',
      createdAt: f.created_at || '',
    }));
}
