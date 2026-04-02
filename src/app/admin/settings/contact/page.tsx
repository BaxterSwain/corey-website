'use client';

import { useEffect, useState } from 'react';

interface ContactSettings {
  id?: string;
  email: string;
  phone?: string;
  instagram?: string;
  location?: string;
}

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<ContactSettings>({
    email: 'contact@coreymccullough.com',
    phone: '',
    instagram: '@coreymcculloughmotorsport',
    location: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const res = await fetch('/api/settings/contact');
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Contact Settings</h1>
        <p className="text-white/50 text-sm mt-1">Manage contact information displayed on the site</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
        {message && (
          <div className={`p-3 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Email</label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 focus:border-[#2a6dc7]/40 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Phone</label>
          <input
            type="tel"
            value={settings.phone || ''}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 focus:border-[#2a6dc7]/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Instagram</label>
          <input
            type="text"
            value={settings.instagram || ''}
            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 focus:border-[#2a6dc7]/40 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white/60 text-sm uppercase tracking-wider mb-2">Location</label>
          <input
            type="text"
            value={settings.location || ''}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
            className="w-full bg-white/[0.03] border border-white/[0.06] text-white px-4 py-3 focus:border-[#2a6dc7]/40 focus:outline-none"
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
