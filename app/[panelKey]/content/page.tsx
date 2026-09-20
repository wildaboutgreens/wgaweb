'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import ImageField from '@/components/admin/ImageField';
import { CONTENT_REGISTRY } from '@/lib/contentRegistry';

interface ContentBlock {
  id: string;
  page: string;
  key: string;
  value_type: string;
  value: string;
  updated_at: string;
}

const PAGES = [
  { value: 'homepage', label: 'Homepage' },
  { value: 'product-listing', label: 'Product Listing' },
  { value: 'product-detail', label: 'Product Detail' },
  { value: 'recipe-khazana', label: 'Recipe Khazana' },
  { value: 'blog', label: 'Blog (Journal)' },
  { value: 'our-story', label: 'Our Story' },
  { value: 'emails', label: 'Emails' },
];

export default function AdminContentPage() {
  const [activePage, setActivePage] = useState(PAGES[0].value);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fields = CONTENT_REGISTRY[activePage] || [];

  const loadBlocks = async (page: string) => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/content/${page}`, {
        cache: 'no-store',
      });
      const pageFields = CONTENT_REGISTRY[page] || [];
      const formData: Record<string, string> = {};

      if (res.ok) {
        const data: ContentBlock[] = await res.json();
        const dataMap = new Map<string, string>();
        for (const b of data) {
          dataMap.set(b.key, b.value);
        }

        for (const f of pageFields) {
          formData[f.key] = dataMap.has(f.key) ? dataMap.get(f.key)! : f.defaultValue;
          if (f.type === 'image_url') {
            const altKey = `${f.key}_alt`;
            formData[altKey] = dataMap.has(altKey) ? dataMap.get(altKey)! : '';
          }
        }
      } else {
        for (const f of pageFields) {
          formData[f.key] = f.defaultValue;
          if (f.type === 'image_url') {
            formData[`${f.key}_alt`] = '';
          }
        }
      }
      setForm(formData);
    } catch (err) {
      console.error('Failed to load content blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlocks(activePage);
    setSaved(false);
  }, [activePage]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const blockArray: { key: string; value: string; value_type: string }[] = [];
      for (const field of fields) {
        blockArray.push({
          key: field.key,
          value: form[field.key] ?? '',
          value_type: field.type,
        });
        if (field.type === 'image_url') {
          blockArray.push({
            key: `${field.key}_alt`,
            value: form[`${field.key}_alt`] ?? '',
            value_type: 'text',
          });
        }
      }

      const res = await adminFetch(`/api/admin/content/${activePage}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: blockArray }),
      });

      if (res.ok) {
        const data: ContentBlock[] = await res.json();
        setSaved(true);
        if (Array.isArray(data)) {
          setForm((prev) => {
            const next = { ...prev };
            for (const b of data) {
              next[b.key] = b.value;
            }
            return next;
          });
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Blocks</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit live site copy and images across key pages. Changes go live immediately upon saving.
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PAGES.map((p) => (
          <button
            key={p.value}
            onClick={() => setActivePage(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activePage === p.value
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Content Fields List */}
      <div className="bg-white rounded-xl border p-6 space-y-6 mb-6 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-400">Loading fields...</div>
        ) : (
          fields.map((field) => (
            <div key={field.key} className="pt-4 first:pt-0 border-t first:border-0 border-gray-100">
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <label className="text-sm font-semibold text-gray-800">{field.label}</label>
                <span className="text-[11px] font-mono text-gray-400 select-none">
                  {field.key}
                </span>
              </div>
              {field.description && (
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">{field.description}</p>
              )}

              {field.type === 'textarea' ? (
                <textarea
                  value={form[field.key] ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none"
                />
              ) : field.type === 'image_url' ? (
                <ImageField
                  value={form[field.key] || null}
                  onChange={(url) =>
                    setForm((prev) => ({
                      ...prev,
                      [field.key]: url,
                    }))
                  }
                  aspectRatio="16/9"
                  folder={`content/${activePage}`}
                  publicId={field.key}
                  acceptVideo={field.key.includes('video') || field.key === 'hero_image_url'}
                  altText={form[`${field.key}_alt`] || ''}
                  onAltTextChange={(alt) =>
                    setForm((prev) => ({
                      ...prev,
                      [`${field.key}_alt`]: alt,
                    }))
                  }
                />
              ) : (
                <input
                  type="text"
                  value={form[field.key] ?? ''}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none"
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center gap-3 sticky bottom-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border shadow-md">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
        {saved && (
          <span className="text-sm text-green-700 font-semibold flex items-center gap-1">
            <span>✓</span> Saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
