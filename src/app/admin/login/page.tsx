'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#dc2626] mb-4">
            <span className="text-white font-black text-lg">CM</span>
          </div>
          <h1 className="text-white text-lg font-bold">Admin Login</h1>
          <p className="text-white/25 text-xs mt-1">Corey McCullough Motorsport</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/[0.06] p-6 space-y-5">
          {error && (
            <div className="bg-[#dc2626]/10 border border-[#dc2626]/20 text-[#dc2626] text-xs p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/30 text-[10px] uppercase tracking-[0.2em] mb-1.5 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-white text-sm focus:border-[#dc2626]/50 focus:outline-none transition-colors"
              placeholder="admin@coreymotorsport.com"
              required
            />
          </div>

          <div>
            <label className="block text-white/30 text-[10px] uppercase tracking-[0.2em] mb-1.5 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] px-3 py-2.5 text-white text-sm focus:border-[#dc2626]/50 focus:outline-none transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#dc2626] hover:bg-[#ef4444] text-white font-semibold text-xs tracking-[0.1em] uppercase py-3 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
