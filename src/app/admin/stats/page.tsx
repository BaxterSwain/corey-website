'use client';

import { useEffect, useState } from 'react';

interface Stat {
  id: number;
  value: number;
  suffix: string;
  label: string;
  order: number;
}

const emptyForm = { value: 0, suffix: '', label: '', order: 0 };

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<number, Stat>>({});
  const [newStat, setNewStat] = useState(emptyForm);
  const [message, setMessage] = useState('');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(Array.isArray(data) ? data : []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const flash = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(''), 3000); };

  const handleSaveEdit = async (id: number) => {
    const data = editing[id];
    if (!data) return;
    try {
      await fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value: String(data.value), suffix: data.suffix, label: data.label, order: Number(data.order) }),
      });
      const next = { ...editing }; delete next[id]; setEditing(next);
      await fetchStats();
      flash('Updated');
    } catch { flash('Failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this stat?')) return;
    try {
      await fetch('/api/stats', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      await fetchStats(); flash('Deleted');
    } catch { flash('Failed'); }
  };

  const handleAdd = async () => {
    if (!newStat.label) return;
    try {
      await fetch('/api/stats', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newStat, value: String(newStat.value), order: Number(newStat.order) }) });
      setNewStat(emptyForm); await fetchStats(); flash('Added');
    } catch { flash('Failed'); }
  };

  const ic = 'bg-white/[0.03] border border-white/[0.08] px-2.5 py-2 text-white text-sm focus:border-[#dc2626]/50 focus:outline-none transition-colors';

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-white/25 text-xs">Loading...</p></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Stats</h1>
          <p className="text-white/25 text-xs mt-0.5">Race statistics</p>
        </div>
        {message && <span className="text-emerald-400 text-xs">{message}</span>}
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Value', 'Suffix', 'Label', 'Order', ''].map((h) => (
                <th key={h} className={`text-white/25 text-[10px] uppercase tracking-[0.15em] font-medium px-4 py-3 ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => {
              const ed = editing[stat.id];
              return (
                <tr key={stat.id} className="border-b border-white/[0.04]">
                  {ed ? (
                    <>
                      <td className="px-4 py-2"><input type="number" value={ed.value} onChange={(e) => setEditing({ ...editing, [stat.id]: { ...ed, value: Number(e.target.value) } })} className={`${ic} w-20`} /></td>
                      <td className="px-4 py-2"><input type="text" value={ed.suffix} onChange={(e) => setEditing({ ...editing, [stat.id]: { ...ed, suffix: e.target.value } })} className={`${ic} w-16`} /></td>
                      <td className="px-4 py-2"><input type="text" value={ed.label} onChange={(e) => setEditing({ ...editing, [stat.id]: { ...ed, label: e.target.value } })} className={`${ic} w-40`} /></td>
                      <td className="px-4 py-2"><input type="number" value={ed.order} onChange={(e) => setEditing({ ...editing, [stat.id]: { ...ed, order: Number(e.target.value) } })} className={`${ic} w-16`} /></td>
                      <td className="px-4 py-2 text-right space-x-2">
                        <button onClick={() => handleSaveEdit(stat.id)} className="text-[#dc2626] text-xs font-medium cursor-pointer">Save</button>
                        <button onClick={() => { const n = { ...editing }; delete n[stat.id]; setEditing(n); }} className="text-white/25 text-xs cursor-pointer">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-white text-sm font-medium">{stat.value}</td>
                      <td className="px-4 py-3 text-white/40 text-sm">{stat.suffix || '--'}</td>
                      <td className="px-4 py-3 text-white/60 text-sm">{stat.label}</td>
                      <td className="px-4 py-3 text-white/25 text-sm">{stat.order}</td>
                      <td className="px-4 py-3 text-right space-x-3">
                        <button onClick={() => setEditing({ ...editing, [stat.id]: { ...stat } })} className="text-white/25 hover:text-white/60 text-xs cursor-pointer">Edit</button>
                        <button onClick={() => handleDelete(stat.id)} className="text-white/25 hover:text-[#dc2626] text-xs cursor-pointer">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add */}
      <div className="bg-white/[0.02] border border-white/[0.06] p-5">
        <h2 className="text-white text-sm font-semibold mb-3">Add Stat</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Value</label>
            <input type="number" value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: Number(e.target.value) })} className={`${ic} w-full`} />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Suffix</label>
            <input type="text" value={newStat.suffix} onChange={(e) => setNewStat({ ...newStat, suffix: e.target.value })} className={`${ic} w-full`} placeholder="+, %" />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Label</label>
            <input type="text" value={newStat.label} onChange={(e) => setNewStat({ ...newStat, label: e.target.value })} className={`${ic} w-full`} placeholder="Race Wins" />
          </div>
          <div>
            <label className="block text-white/25 text-[10px] uppercase tracking-[0.15em] mb-1 font-medium">Order</label>
            <input type="number" value={newStat.order} onChange={(e) => setNewStat({ ...newStat, order: Number(e.target.value) })} className={`${ic} w-full`} />
          </div>
        </div>
        <button onClick={handleAdd} className="mt-3 bg-[#dc2626] hover:bg-[#ef4444] text-white font-medium text-xs px-4 py-2 transition-colors cursor-pointer">Add</button>
      </div>
    </div>
  );
}
