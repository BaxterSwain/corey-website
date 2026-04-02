import type { JSX } from 'react';

interface SkeletonProps {
  className?: string;
  rows?: number;
  height?: string;
}

export function SkeletonCard({ className = '', height = 'h-32' }: { className?: string; height?: string }) {
  return (
    <div className={`bg-white/[0.02] border border-white/[0.06] rounded-lg ${height} ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded-lg" />
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="w-full h-4 bg-white/[0.02] border border-white/[0.06] rounded">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-4 mb-3">
        <div className="h-8 bg-white/[0.02] border border-white/[0.06] rounded">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded" />
        </div>
        <div className="h-8 bg-white/[0.02] border border-white/[0.06] rounded">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded" />
        </div>
        <div className="h-8 bg-white/[0.02] border border-white/[0.06] rounded">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded" />
        </div>
        <div className="h-8 bg-white/[0.02] border border-white/[0.06] rounded">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded" />
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 mb-2">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-10 bg-white/[0.02] border border-white/[0.06] rounded">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ columns = 3, rows = 4, className = '' }: { columns?: number; rows?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-${columns} gap-4 ${className}`}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <div key={i} className="aspect-square bg-white/[0.02] border border-white/[0.06] rounded-lg">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-pulse rounded-lg" />
        </div>
      ))}
    </div>
  );
}