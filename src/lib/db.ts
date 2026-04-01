import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Lazy Supabase client — avoids crashing at module load when env vars are missing
let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

// =====================
// AUTH
// =====================

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await getSupabase()
    .from('users')
    .insert({ email, passwordHash })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

// =====================
// SITE CONTENT
// =====================

export async function getSiteContent(section: string) {
  const { data, error } = await getSupabase()
    .from('site_content')
    .select('key, value')
    .eq('section', section);

  if (error) throw error;

  const result: Record<string, string> = {};
  data.forEach((item) => {
    result[item.key] = item.value;
  });

  return result;
}

export async function upsertSiteContent(section: string, key: string, value: string) {
  const { error } = await getSupabase()
    .from('site_content')
    .upsert(
      { section, key, value },
      { onConflict: 'section,key' }
    );

  if (error) throw error;
}

// =====================
// STATS
// =====================

export async function getStats() {
  const { data, error } = await getSupabase()
    .from('stats')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createStat(stat: any) {
  const { data, error } = await getSupabase()
    .from('stats')
    .insert(stat)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStat(id: number, updates: any) {
  const { data, error } = await getSupabase()
    .from('stats')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStat(id: number) {
  const { error } = await getSupabase()
    .from('stats')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================
// HIGHLIGHTS
// =====================

export async function getHighlights() {
  const { data, error } = await getSupabase()
    .from('highlights')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getHighlight(id: number) {
  const { data, error } = await getSupabase()
    .from('highlights')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function createHighlight(item: any) {
  const { data, error } = await getSupabase()
    .from('highlights')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHighlight(id: number, updates: any) {
  const { data, error } = await getSupabase()
    .from('highlights')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHighlight(id: number) {
  const { error } = await getSupabase()
    .from('highlights')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================
// GALLERY
// =====================

export async function getGallery() {
  const { data, error } = await getSupabase()
    .from('gallery')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createGalleryItem(item: any) {
  const { data, error } = await getSupabase()
    .from('gallery')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryItem(id: number, updates: any) {
  const { data, error } = await getSupabase()
    .from('gallery')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGalleryItem(id: number) {
  const { error } = await getSupabase()
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================
// CONTACTS
// =====================

export async function createContact(contact: any) {
  const { data, error } = await getSupabase()
    .from('contacts')
    .insert(contact)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContacts() {
  const { data, error } = await getSupabase()
    .from('contacts')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUnreadContactsCount() {
  const { count, error } = await getSupabase()
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

  if (error) throw error;
  return count || 0;
}
// =====================
// COMPATIBILITY (KEEP OLD API)
// =====================

export async function getContent(section: string) {
  return getSiteContent(section);
}

export async function updateContent(section: string, key: string, value: string) {
  return upsertSiteContent(section, key, value);
}