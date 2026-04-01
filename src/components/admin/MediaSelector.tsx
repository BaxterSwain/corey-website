'use client';

import { useState, useRef, useEffect } from 'react';

interface MediaFile {
  name: string;
  url: string;
}

interface MediaSelectorProps {
  value: string;
  onChange: (url: string) => void;
  mediaFiles: MediaFile[];
  inputClass: string;
  placeholder?: string;
}

function isImage(name: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(name);
}

export default function MediaSelector({
  value,
  onChange,
  mediaFiles,
  inputClass,
  placeholder = 'Select media or paste URL...',
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedFile = mediaFiles.find((f) => f.url === value);
  const filtered = mediaFiles.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  if (mediaFiles.length === 0) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} w-full`}
        placeholder="https://..."
      />
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`${inputClass} w-full text-left flex items-center gap-2 cursor-pointer`}
      >
        {selectedFile ? (
          <>
            {isImage(selectedFile.name) && (
              <img
                src={selectedFile.url}
                alt=""
                className="w-5 h-5 object-cover flex-shrink-0"
              />
            )}
            <span className="truncate flex-1">{selectedFile.name}</span>
          </>
        ) : value ? (
          <span className="truncate flex-1 text-white/60">{value}</span>
        ) : (
          <span className="text-white/20 flex-1">{placeholder}</span>
        )}
        <svg
          className={`w-3 h-3 text-white/20 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#111] border border-white/[0.1] shadow-xl max-h-72 flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-white/[0.06]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full bg-white/[0.03] border border-white/[0.08] px-2 py-1.5 text-white text-xs focus:border-[#dc2626]/50 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Options */}
          <div className="overflow-y-auto flex-1">
            {/* Clear option */}
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
                setSearch('');
              }}
              className="w-full text-left px-3 py-2 text-white/30 text-xs hover:bg-white/[0.05] cursor-pointer"
            >
              None (clear selection)
            </button>

            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-white/15 text-xs text-center">
                No files found
              </div>
            ) : (
              filtered.map((f) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => {
                    onChange(f.url);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-white/[0.05] cursor-pointer transition-colors ${
                    f.url === value ? 'bg-[#dc2626]/10' : ''
                  }`}
                >
                  {isImage(f.name) ? (
                    <img
                      src={f.url}
                      alt=""
                      className="w-8 h-8 object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  <span className="text-white text-xs truncate">{f.name}</span>
                </button>
              ))
            )}
          </div>

          {/* Manual URL input */}
          <div className="p-2 border-t border-white/[0.06]">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste URL manually..."
              className="w-full bg-white/[0.03] border border-white/[0.08] px-2 py-1.5 text-white text-xs focus:border-[#dc2626]/50 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
