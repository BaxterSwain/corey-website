'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  highlights: number;
  gallery: number;
  messages: number;
}

const quickLinks = [
  { label: 'Content', href: '/admin/content', desc: 'Hero & About sections' },
  { label: 'Stats', href: '/admin/stats', desc: 'Race statistics' },
  { label: 'Highlights', href: '/admin/highlights', desc: 'Video highlights' },
  { label: 'Gallery', href: '/admin/gallery', desc: 'Photo gallery' },
  { label: 'Media', href: '/admin/media', desc: 'Upload & manage files' },
  { label: 'Messages', href: '/admin/messages', desc: 'Contact submissions' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ highlights: 0, gallery: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [hlRes, galRes, msgRes] = await Promise.all([
          fetch('/api/highlights'),
          fetch('/api/gallery'),
          fetch('/api/contacts'),
        ]);
        const [highlights, gallery, messages] = await Promise.all([
          hlRes.json(),
          galRes.json(),
          msgRes.json(),
        ]);
        setStats({
          highlights: Array.isArray(highlights) ? highlights.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          messages: messages?.unread ?? 0,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Highlights', value: stats.highlights },
    { label: 'Gallery', value: stats.gallery },
    { label: 'Messages', value: stats.messages },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-xl font-bold">Dashboard</h1>
        <p className="text-white/25 text-xs mt-1">Corey McCullough Motorsport</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white/[0.02] border border-white/[0.06] p-5"
          >
            <p className="text-white/25 text-[10px] uppercase tracking-[0.15em] font-medium mb-1">{card.label}</p>
            <p className="text-white text-3xl font-bold">
              {loading ? '--' : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium mb-3">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white/[0.02] border border-white/[0.06] p-4 hover:border-white/[0.12] transition-colors group"
          >
            <span className="text-white font-medium text-sm group-hover:text-[#dc2626] transition-colors">
              {link.label}
            </span>
            <p className="text-white/20 text-xs mt-0.5">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
