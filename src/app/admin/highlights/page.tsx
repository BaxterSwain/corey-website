'use client';

import { useEffect, useState } from 'react';
import MediaSelector from '@/components/admin/MediaSelector';

interface Highlight {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  views: string;
  videoUrl: string;
  badge: string;
  badgeColor: string;
  gradient: string;
  featured: boolean;
  gallery_id?: number;
}

const emptyForm = { title: '', subtitle: '', duration: '', views: '', videoUrl: '', badge: '', badgeColor: '', gradient: '', featured: false, galleryId: null as number | null };

export default function AdminHighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Highlight | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string }[]>([]);

  const fetchHighlights = async () => {
    try {
      const res = await fetch('/api/highlights');
      const data = await res.json();
      setHighlights(Array.isArray(data) ? data : []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMediaFiles(Array.isArray(data) ? data : []);
    } catch {}
  };

  useEffect(() => { fetchHighlights(); fetchMedia(); }, []);

  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const handleEdit = (h: Highlight) => {
    setEditing(h);
    setForm({ title: h.title, subtitle: h.subtitle, duration: h.duration, views: h.views, videoUrl: h.videoUrl, badge: h.badge, badgeColor: h.badgeColor, gradient: h.gradient, featured: h.featured, galleryId: h.gallery_id || null });
  };

  const handleSave = async () => {
    if (!form.title) return;
    try {
      if (editing) {
        await fetch(`/api/highlights/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        flash('Updated');
      } else {
        await fetch('/api/highlights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        flash('Added');
      }
      setEditing(null); setForm(emptyForm); await fetchHighlights();
    } catch { flash('Failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete?')) return;
    try { await fetch(`/api/highlights/${id}`, { method: 'DELETE' }); await fetchHighlights(); flash('Deleted'); } catch { flash('Failed'); }
  };

  const handleToggleFeatured = async (h: Highlight) => {
    try { await fetch(`/api/highlights/${h.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ featured: !h.featured }) }); await fetchHighlights(); } catch { flash('Failed'); }
  };

  const ic = 'bg-white/[0.03] border border-white/[0.08] px-2.5 py-2 text-white text-sm focus:border-[#dc2626]/50 focus:outline-none transition-colors';

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-white/25 text-xs">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Highlights</h1>
          <p className="text-white/25 text-xs mt-0.5">Manage highlight videos</p>
        </div>
        {message && <span className="text-emerald-400 text-xs">{message}</span>}
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Title', 'Duration', 'Badge', 'Featured', ''].map((h) => (
                <th key={h} className={`text-white/25 text-[10px] uppercase tracking-[0.15em] font-medium px-4 py-3 ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {highlights.map((h) => (
              <tr key={h.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3">
                  <div className="text-white text-sm font-medium">{h.title}</div>
                  <div className="text-white/25 text-xs">{h.subtitle}</div>
                </td>
                <td className="px-4 py-3 text-white/40 text-sm">{h.duration || '--'}</td>
                <td className="px-4 py-3">
                  {h.badge ? <span className="bg-[#dc2626]/15 text-[#dc2626] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">{h.badge}</span> : <span className="text-white/20">--</span>}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleFeatured(h)} className={`w-8 h-4 rounded-full transition-colors cursor-pointer relative ${h.featured ? 'bg-[#dc2626]' : 'bg-white/10'}`}>
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${h.featured ? 'left-4' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEdit(h)} className="text-white/25 hover:text-white/60 text-xs cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(h.id)} className="text-white/25 hover:text-[#dc2626] text-xs cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] p-5">
        <h2 className="text-white text-sm font-semibold mb-3">{editing ? 'Edit Highlight' : 'Add Highlight'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-3">
          <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Gallery Image</label>
          <select
            value={form.galleryId || ''}
            onChange={(e) => setForm({ ...form, galleryId: e.target.value ? Number(e.target.value) : null })}
            className={`${ic} w-full`}
          >
            <option value="">No image</option>
            {mediaFiles.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)).map(file => (
              <option key={file.url} value={file.url}>{file.name}</option>
            ))}
          </select>
        </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`${ic} w-full`} />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Subtitle</label>
            <input type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={`${ic} w-full`} />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Duration</label>
            <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={`${ic} w-full`} placeholder="3:45" />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Views</label>
            <input type="text" value={form.views} onChange={(e) => setForm({ ...form, views: e.target.value })} className={`${ic} w-full`} />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Video URL / Media File</label>
            <MediaSelector
              value={form.videoUrl}
              onChange={(url) => setForm({ ...form, videoUrl: url })}
              mediaFiles={mediaFiles.filter(f => f.name.match(/\.(mp4|webm|mov)$/i))}
              inputClass={ic}
              placeholder="Select video or paste URL..."
            />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Badge</label>
            <input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className={`${ic} w-full`} placeholder="NEW" />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Gradient</label>
            <input type="text" value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} className={`${ic} w-full`} placeholder="from-red-600 to-red-900" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-3.5 h-3.5 accent-[#dc2626]" />
              <span className="text-white/40 text-xs">Featured</span>
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={handleSave} className="bg-[#dc2626] hover:bg-[#ef4444] text-white font-medium text-xs px-4 py-2 transition-colors cursor-pointer">
            {editing ? 'Save' : 'Add'}
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm(emptyForm); }} className="bg-white/[0.05] text-white/40 font-medium text-xs px-4 py-2 transition-colors cursor-pointer hover:text-white/60">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
