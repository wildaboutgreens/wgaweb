'use client';

import { useRef, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

interface ImageFieldProps {
  value: string | null;
  onChange: (newUrl: string, publicId?: string) => void;
  label?: string;
  aspectRatio?: string; // CSS aspect-ratio value, e.g. "16/9", "1/1"
  folder?: string;
  publicId?: string;
}

export default function ImageField({
  value,
  onChange,
  label,
  aspectRatio = '16/9',
  folder,
  publicId,
}: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (!uploading) fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }
      if (publicId) {
        formData.append('publicId', publicId);
      }

      const res = await adminFetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url, data.publicId);
      } else {
        const errData = await res.json().catch(() => null);
        setError(errData?.error || `Upload failed (${res.status})`);
      }
    } catch (err) {
      console.error('ImageField upload error:', err);
      setError('Upload failed — check your connection and try again');
    } finally {
      setUploading(false);
      // Reset so the same file can be re-selected
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}

      <div
        onClick={handleClick}
        className="relative group cursor-pointer rounded-xl overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-colors bg-gray-50 inline-block"
        style={{ aspectRatio }}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label || 'Image'}
              className="w-full h-full object-cover"
            />
            {/* Hover overlay */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1.5 rounded-lg">
                  Replace Image
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 min-h-[6rem]">
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Click to upload</span>
          </div>
        )}

        {/* Uploading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-2" />
            <span className="text-xs font-medium text-gray-600">Uploading…</span>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
