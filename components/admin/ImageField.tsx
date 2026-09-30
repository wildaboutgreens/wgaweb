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
  altText?: string;
  onAltTextChange?: (altText: string) => void;
  acceptVideo?: boolean;
  objectFit?: 'cover' | 'contain';
  onRemove?: () => void;
}

const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Netlify function payload safety limit

function isVideoUrl(url: string | null): boolean {
  if (!url) return false;
  return (
    /\.(mp4|webm|ogg|mov|m4v|mkv|avi)(\?.*)?$/i.test(url) ||
    url.includes('/video/upload/') ||
    url.includes('/video/')
  );
}

async function resizeImageIfNeeded(file: File, maxDimension = 2000, quality = 0.85): Promise<File> {
  const isVideo =
    file.type.startsWith('video/') ||
    /\.(mp4|webm|ogg|mov|m4v|mkv|avi)$/i.test(file.name);
  if (isVideo) return file;

  // Only resize common raster images, not vector/animated/video
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  return new Promise((resolve) => {
    const img = document.createElement('img');
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // If already within max dimension, return original file
      if (width <= maxDimension && height <= maxDimension) {
        resolve(file);
        return;
      }

      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const resized = new File([blob], file.name, {
            type: mimeType,
            lastModified: Date.now(),
          });
          resolve(resized);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export default function ImageField({
  value,
  onChange,
  label,
  aspectRatio = '16/9',
  folder,
  publicId,
  altText,
  onAltTextChange,
  acceptVideo = false,
  objectFit = 'cover',
  onRemove,
}: ImageFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isVideo = isVideoUrl(value);

  const handleClick = () => {
    if (!uploading) fileRef.current?.click();
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onRemove) {
      onRemove();
    } else {
      onChange('', '');
    }
    if (onAltTextChange) {
      onAltTextChange('');
    }
    if (fileRef.current) {
      fileRef.current.value = '';
    }
    setError(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Client-side canvas resize for images larger than 2000px
      const fileToUpload = await resizeImageIfNeeded(rawFile, 2000, 0.85);

      // 2. Pre-upload file size check (max 4.5 MB)
      if (fileToUpload.size > MAX_UPLOAD_BYTES) {
        const sizeMB = (fileToUpload.size / (1024 * 1024)).toFixed(1);
        setError(`File is too large (${sizeMB} MB). Maximum allowed upload size is 4.5 MB.`);
        return;
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
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
      setError('Upload failed. Check your connection and try again.');
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
            {isVideo ? (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => {
                    if (el) {
                      el.muted = true;
                      el.defaultMuted = true;
                      el.play().catch(() => {});
                    }
                  }}
                  src={value}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 z-10 px-2 py-0.5 bg-black/70 text-white text-[11px] font-semibold rounded pointer-events-none flex items-center gap-1 shadow">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Video Preview
                </span>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt={label || 'Image'}
                className={`w-full h-full ${objectFit === 'contain' ? 'object-contain p-3' : 'object-cover'}`}
              />
            )}

            {/* Top-Right Remove Button */}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 z-20 px-2.5 py-1 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
                title={acceptVideo || isVideo ? 'Remove media' : 'Remove image'}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Remove</span>
              </button>
            )}

            {/* Hover overlay */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-3 py-1.5 rounded-lg">
                  {isVideo ? 'Replace Video' : acceptVideo ? 'Replace Media' : 'Replace Image'}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 min-h-[6rem]">
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">
              {acceptVideo ? 'Click to upload video or photo' : 'Click to upload'}
            </span>
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

      {/* Clear/Remove button below preview */}
      {value && !uploading && (
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 border border-red-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Remove {acceptVideo || isVideo ? 'Media' : 'Image'}</span>
          </button>
          <span className="text-[11px] text-gray-400">or click preview to replace</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept={acceptVideo ? 'image/*,video/*' : 'image/*'}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Alt text input (only relevant for images, not videos) */}
      {onAltTextChange && !isVideo && (
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Alt Text
          </label>
          <input
            type="text"
            value={altText || ''}
            onChange={(e) => onAltTextChange(e.target.value)}
            placeholder="Describe this image for accessibility"
            className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none"
          />
        </div>
      )}
    </div>
  );
}
