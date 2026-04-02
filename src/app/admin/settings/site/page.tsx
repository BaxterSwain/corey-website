'use client';

import { useEffect, useState } from 'react';

interface SiteSettings {
  site_title: string;
  meta_description?: string;
  favicon_url?: string;
  theme_primary_color?: string;
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: 'Corey McCullough | Motorsport Racer',
    meta_description: '',
    favicon_url: '/favicon.ico',
    theme_primary_color: '#2a6dc7',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const res = await fetch('/api/settings/site');
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Site settings saved successfully' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save site settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Site Settings</h1>
        <p className="text-white/50 text-sm mt-1">Manage site title, meta description, favicon and branding</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
        {message && (
          <div className={`p-3 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Site Title</label>
          <input
            type="text"
            value={settings.site_title}
            onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 focus:border-[#2a6dc7]/40 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Meta Description</label>
          <textarea
            value={settings.meta_description || ''}
            onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
            rows={3}
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 focus:border-[#2a6dc7]/40 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Favicon URL</label>
          <input
            type="text"
            value={settings.favicon_url || ''}
            onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 focus:border-[#2a6dc7]/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Theme Primary Color</label>
          <input
            type="color"
            value={settings.theme_primary_color || '#2a6dc7'}
            onChange={(e) => setSettings({ ...settings, theme_primary_color: e.target.value })}
            className="w-full h-12 bg-white/[0.03] border border-white/[0.06] text-white px-2 py-1 focus:border-[#2a6dc7]/40 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#2a6dc7] hover:bg-[#3a7dd7] text-[#030303] font-bold text-sm tracking-wider uppercase px-6 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}