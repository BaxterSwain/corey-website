'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isImage(name: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(name);
}

function isVideo(name: string): boolean {
  return /\.(mp4|webm|mov|avi)$/i.test(name);
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<UploadingFile[]>([]);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCountRef = useRef(0);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const uploadFile = useCallback(async (file: File) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const uploadEntry: UploadingFile = { id, name: file.name, progress: 0, status: 'uploading' };

    setUploads((prev) => [...prev, uploadEntry]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploads((prev) =>
              prev.map((u) => (u.id === id ? { ...u, progress: pct } : u))
            );
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploads((prev) =>
              prev.map((u) => (u.id === id ? { ...u, progress: 100, status: 'done' } : u))
            );
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.open('POST', '/api/media');
        xhr.send(formData);
      });

      // Clear completed upload after a delay
      setTimeout(() => {
        setUploads((prev) => prev.filter((u) => u.id !== id));
      }, 2000);

      await fetchFiles();
    } catch {
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'error', error: 'Upload failed' } : u))
      );
    }
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      Array.from(fileList).forEach((file) => uploadFile(file));
    },
    [uploadFile]
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current -= 1;
    if (dragCountRef.current <= 0) {
      dragCountRef.current = 0;
      setDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCountRef.current = 0;
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return;
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });
      if (res.ok) {
        flash('Deleted');
        await fetchFiles();
      } else {
        flash('Delete failed');
      }
    } catch {
      flash('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/25 text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-xl font-bold">Media</h1>
          <p className="text-white/25 text-xs mt-0.5">
            Upload and manage images and videos
          </p>
        </div>
        {message && <span className="text-emerald-400 text-xs">{message}</span>}
      </div>

      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed mb-6 p-10 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-[#dc2626] bg-[#dc2626]/5'
            : 'border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="text-white/30 text-sm mb-1">
          {dragging ? 'Drop files here' : 'Drag and drop files here'}
        </div>
        <div className="text-white/15 text-xs">
          or click to browse -- images and videos
        </div>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="mb-6 space-y-2">
          {uploads.map((u) => (
            <div
              key={u.id}
              className="bg-white/[0.02] border border-white/[0.06] px-4 py-3 flex items-center gap-3"
            >
              <span className="text-white text-xs truncate flex-1">{u.name}</span>
              {u.status === 'uploading' && (
                <div className="w-32 h-1.5 bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-[#dc2626] transition-all duration-300"
                    style={{ width: `${u.progress}%` }}
                  />
                </div>
              )}
              {u.status === 'uploading' && (
                <span className="text-white/30 text-[10px] w-8 text-right">
                  {u.progress}%
                </span>
              )}
              {u.status === 'done' && (
                <span className="text-emerald-400 text-[10px]">Done</span>
              )}
              {u.status === 'error' && (
                <span className="text-red-400 text-[10px]">{u.error}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Media grid */}
      {files.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/15 text-sm">No media files yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((file) => (
            <div
              key={file.name}
              className="bg-white/[0.02] border border-white/[0.06] group relative"
            >
              {/* Preview */}
              <div className="aspect-square bg-black/20 flex items-center justify-center overflow-hidden">
                {isImage(file.name) ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : isVideo(file.name) ? (
                  <div className="flex flex-col items-center gap-1">
                    <svg
                      className="w-8 h-8 text-white/20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-white/20 text-[9px] uppercase tracking-wider">
                      Video
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-white/20 text-[9px] uppercase tracking-wider">
                      File
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-2.5 py-2">
                <p className="text-white text-[11px] truncate" title={file.name}>
                  {file.name}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-white/20 text-[10px]">
                    {formatBytes(file.size)}
                  </span>
                  <span className="text-white/20 text-[10px]">
                    {formatDate(file.createdAt)}
                  </span>
                </div>
              </div>

              {/* Delete overlay */}
              <button
                onClick={() => handleDelete(file.name)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 text-white/40 hover:text-[#dc2626] hover:bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                title="Delete"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
