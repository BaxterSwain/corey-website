'use client';

import { useEffect, useState } from 'react';

interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  enquiryType: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch('/api/contacts');
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch {} finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-white/25 text-xs">Loading...</p></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-white text-xl font-bold">Messages</h1>
        <p className="text-white/25 text-xs mt-0.5">Contact form submissions ({messages.length})</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/[0.06] p-12 text-center">
          <p className="text-white/25 text-xs">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white/[0.02] border border-white/[0.06]">
              <button
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                className="w-full text-left px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-white text-sm font-medium">{msg.firstName} {msg.lastName}</span>
                    <span className="text-white/25 text-xs">{msg.email}</span>
                    {msg.enquiryType && (
                      <span className="bg-[#dc2626]/10 text-[#dc2626] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">{msg.enquiryType}</span>
                    )}
                  </div>
                  <span className="text-white/20 text-xs">{formatDate(msg.createdAt)}</span>
                </div>
                {expandedId !== msg.id && (
                  <p className="text-white/20 text-xs mt-1 truncate">{msg.message}</p>
                )}
              </button>
              {expandedId === msg.id && (
                <div className="px-4 pb-4 border-t border-white/[0.04]">
                  <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap pt-3">{msg.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
