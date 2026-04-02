import { createClient, SupabaseClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Lazy Supabase client — avoids crashing at module load when env vars are missing
let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Missing Supabase env vars');
    }
    _supabase = createClient(url, key);
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
// CONTACT SETTINGS
// =====================

export async function getContactSettings() {
  const { data, error } = await getSupabase()
    .from('contact_settings')
    .select('*')
    .single();

  if (error) {
    // Return defaults if not found
    return {
      email: 'contact@coreymccullough.com',
      phone: '',
      instagram: '@coreymcculloughmotorsport',
      location: ''
    };
  }
  return data;
}

export async function updateContactSettings(settings: {
  email: string;
  phone?: string;
  instagram?: string;
  location?: string;
}) {
  const { data, error } = await getSupabase()
    .from('contact_settings')
    .upsert({
      id: await getContactSettings().then(s => s.id || ''),
      email: settings.email,
      phone: settings.phone || '',
      instagram: settings.instagram || '',
      location: settings.location || '',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  const { data, error } = await getSupabase()
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    // Return defaults
    return {
      id: '1',
      site_title: 'Corey McCullough | Motorsport Racer',
      meta_description: 'Official website of Corey McCullough - professional motorsport racer pushing the limits of speed, precision, and performance.',
      favicon_url: '/favicon.ico',
      theme_primary_color: '#2a6dc7'
    };
  }
  return data;
}

export async function updateSiteSettings(settings: {
  site_title?: string;
  meta_description?: string;
  favicon_url?: string;
  theme_primary_color?: string;
}) {
  const { data, error } = await getSupabase()
    .from('site_settings')
    .upsert({
      id: '1',
      site_title: settings?.site_title,
      meta_description: settings?.meta_description,
      favicon_url: settings?.favicon_url,
      theme_primary_color: settings?.theme_primary_color,
    }, { onConflict: 'id' })
    .select()
    .single();

  if (error) throw error;
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
  // value is stored as text in Supabase — parse to number for frontend
  return (data || []).map((s: any) => ({ ...s, value: Number(s.value) || 0 }));
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
    .select(`*, gallery (*)`)
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

export async function getContacts(filters?: { query?: string; enquiryType?: string; sortBy?: string; order?: string }) {
  let query = getSupabase()
    .from('contacts')
    .select('*');

  // Apply search query
  if (filters?.query) {
    query = query.or(`firstName.ilike.%${filters.query}%,lastName.ilike.%${filters.query}%,email.ilike.%${filters.query}%,message.ilike.%${filters.query}%`);
  }

  // Apply enquiry type filter
  if (filters?.enquiryType) {
    query = query.eq('enquiryType', filters.enquiryType);
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'createdAt';
  const order = (filters?.order || 'desc').toLowerCase() === 'desc';
  query = query.order(sortBy, { ascending: !order });

  const { data, error } = await query;

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