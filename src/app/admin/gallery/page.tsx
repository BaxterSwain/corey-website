'use client';

import { useEffect, useState } from 'react';
import MediaSelector from '@/components/admin/MediaSelector';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  gradient: string;
  span: string;
}

const emptyForm = { title: '', category: '', imageUrl: '', gradient: '', span: '' };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string }[]>([]);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
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

  useEffect(() => { fetchItems(); fetchMedia(); }, []);

  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const handleEdit = (item: GalleryItem) => {
    setEditing(item);
    setForm({ title: item.title, category: item.category, imageUrl: item.imageUrl, gradient: item.gradient, span: item.span });
  };

  const handleSave = async () => {
    if (!form.title) return;
    try {
      if (editing) {
        await fetch(`/api/gallery/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        flash('Updated');
      } else {
        await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        flash('Added');
      }
      setEditing(null); setForm(emptyForm); await fetchItems();
    } catch { flash('Failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete?')) return;
    try { await fetch(`/api/gallery/${id}`, { method: 'DELETE' }); await fetchItems(); flash('Deleted'); } catch { flash('Failed'); }
  };

  const ic = 'bg-white/[0.03] border border-white/[0.08] px-2.5 py-2 text-white text-sm focus:border-[#dc2626]/50 focus:outline-none transition-colors';

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-white/25 text-xs">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Gallery</h1>
          <p className="text-white/25 text-xs mt-0.5">Manage gallery photos</p>
        </div>
        {message && <span className="text-emerald-400 text-xs">{message}</span>}
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Preview', 'Title', 'Category', 'Span', ''].map((h) => (
                <th key={h} className={`text-white/25 text-[10px] uppercase tracking-[0.15em] font-medium px-4 py-3 ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-white/[0.04]">
                <td className="px-4 py-3">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-12 h-12 object-cover" />
                  ) : (
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient}`} />
                  )}
                </td>
                <td className="px-4 py-3 text-white text-sm font-medium">{item.title}</td>
                <td className="px-4 py-3 text-white/40 text-sm">{item.category || '--'}</td>
                <td className="px-4 py-3 text-white/25 text-xs">{item.span || 'default'}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEdit(item)} className="text-white/25 hover:text-white/60 text-xs cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-white/25 hover:text-[#dc2626] text-xs cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div className="bg-white/[0.02] border border-white/[0.06] p-5">
        <h2 className="text-white text-sm font-semibold mb-3">{editing ? 'Edit Item' : 'Add Item'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`${ic} w-full`} />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Category</label>
            <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`${ic} w-full`} />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Image / Media File</label>
            <MediaSelector
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              mediaFiles={mediaFiles.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i))}
              inputClass={ic}
            />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Gradient</label>
            <input type="text" value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} className={`${ic} w-full`} placeholder="from-red-600 to-black" />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Span</label>
            <select value={form.span} onChange={(e) => setForm({ ...form, span: e.target.value })} className={`${ic} w-full`}>
              <option value="">Default</option>
              <option value="col-span-2">col-span-2</option>
              <option value="col-span-2 row-span-2">col-span-2 row-span-2</option>
            </select>
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
