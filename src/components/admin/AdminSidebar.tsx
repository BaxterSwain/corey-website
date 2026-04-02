'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'D' },
  { label: 'Content', href: '/admin/content', icon: 'C' },
  { label: 'Stats', href: '/admin/stats', icon: 'S' },
  { label: 'Highlights', href: '/admin/highlights', icon: 'H' },
  { label: 'Gallery', href: '/admin/gallery', icon: 'G' },
  { label: 'Media', href: '/admin/media', icon: 'M' },
  { label: 'Messages', href: '/admin/messages', icon: 'I' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#0a0a0a] border border-white/[0.06] hover:bg-[#0a0a0a]/90 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-56 bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#dc2626] flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">CM</span>
            </div>
            <div>
              <p className="text-white font-semibold text-xs">Admin</p>
              <p className="text-white/25 text-[10px]">Corey Motorsport</p>
            </div>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
              isActive(item.href)
                ? 'bg-[#dc2626]/10 text-[#dc2626] font-semibold'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
            }`}
          >
            <span className={`w-5 h-5 flex items-center justify-center text-[9px] font-bold ${
              isActive(item.href) ? 'bg-[#dc2626]/20 text-[#dc2626]' : 'bg-white/[0.05] text-white/30'
            }`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 py-3 border-t border-white/[0.06] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          <span className="text-xs">&nearr;</span>
          <span>View Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/30 hover:text-[#dc2626] transition-colors cursor-pointer"
        >
          <span className="text-xs">&larr;</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  </>
);
}
