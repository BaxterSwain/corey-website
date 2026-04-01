'use client';

import { useEffect, useState } from 'react';

interface ContentData {
  [key: string]: string;
}

export default function AdminContentPage() {
  const [hero, setHero] = useState<ContentData>({});
  const [about, setAbout] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        setHero(data.hero || {});
        setAbout(data.about || {});
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const updates: { section: string; key: string; value: string }[] = [];
      for (const [key, value] of Object.entries(hero)) {
        updates.push({ section: 'hero', key, value });
      }
      for (const [key, value] of Object.entries(about)) {
        updates.push({ section: 'about', key, value });
      }
      for (const update of updates) {
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        });
      }
      setMessage('Saved');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-white text-sm focus:border-[#dc2626]/50 focus:outline-none transition-colors';
  const labelClass = 'block text-white/30 text-[10px] uppercase tracking-[0.15em] mb-1.5 font-medium';

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-white/25 text-xs">Loading...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Content</h1>
          <p className="text-white/25 text-xs mt-0.5">Edit hero and about sections</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-xs ${message === 'Saved' ? 'text-emerald-400' : 'text-red-400'}`}>{message}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#dc2626] hover:bg-[#ef4444] text-white font-medium text-xs px-4 py-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white/[0.02] border border-white/[0.06] p-5 mb-4">
        <h2 className="text-white text-sm font-semibold mb-4">Hero Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input type="text" value={hero.firstName || ''} onChange={(e) => setHero({ ...hero, firstName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input type="text" value={hero.lastName || ''} onChange={(e) => setHero({ ...hero, lastName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Badge</label>
            <input type="text" value={hero.badge || ''} onChange={(e) => setHero({ ...hero, badge: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input type="text" value={hero.instagramUrl || ''} onChange={(e) => setHero({ ...hero, instagramUrl: e.target.value })} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Tagline</label>
            <input type="text" value={hero.tagline || ''} onChange={(e) => setHero({ ...hero, tagline: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white/[0.02] border border-white/[0.06] p-5">
        <h2 className="text-white text-sm font-semibold mb-4">About Section</h2>
        <div className="space-y-4">
          {['bio1', 'bio2', 'bio3'].map((key, i) => (
            <div key={key}>
              <label className={labelClass}>Bio Paragraph {i + 1}</label>
              <textarea
                value={about[key] || ''}
                onChange={(e) => setAbout({ ...about, [key]: e.target.value })}
                className={`${inputClass} h-24 resize-y`}
              />
            </div>
          ))}
          <div>
            <label className={labelClass}>Tags (JSON)</label>
            <textarea
              value={about.tags || '[]'}
              onChange={(e) => setAbout({ ...about, tags: e.target.value })}
              className={`${inputClass} h-16 resize-y font-mono text-xs`}
            />
          </div>
          <div>
            <label className={labelClass}>Traits (JSON)</label>
            <textarea
              value={about.traits || '[]'}
              onChange={(e) => setAbout({ ...about, traits: e.target.value })}
              className={`${inputClass} h-32 resize-y font-mono text-xs`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
