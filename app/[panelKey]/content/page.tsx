'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

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
  { value: 'our-story', label: 'Our Story' },
];

// Human-readable labels for known keys
const KEY_LABELS: Record<string, string> = {
  hero_title: 'Hero Title',
  hero_subtitle: 'Hero Subtitle',
  hero_cta_text: 'Hero CTA Button Text',
  hero_cta_link: 'Hero CTA Button Link',
  hero_image_url: 'Hero Background Image',
  why_section_title: 'Why Section Title',
  why_section_subtitle: 'Why Section Subtitle',
  cta_title: 'CTA Section Title',
  cta_subtitle: 'CTA Section Subtitle',
  cta_button_text: 'CTA Button Text',
  cta_button_link: 'CTA Button Link',
  page_title: 'Page Title',
  page_subtitle: 'Page Subtitle',
  section_1_title: 'Section 1 Title',
  section_1_body: 'Section 1 Body',
  section_2_title: 'Section 2 Title',
  section_2_body: 'Section 2 Body',
  section_3_title: 'Section 3 Title',
  section_3_body: 'Section 3 Body',
  section_4_title: 'Section 4 Title',
  section_4_body: 'Section 4 Body',
  banner_text: 'Banner Text',
  meta_description: 'Meta Description',
};

function humanLabel(key: string): string {
  return KEY_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminContentPage() {
  const [activePage, setActivePage] = useState(PAGES[0].value);
  const [form, setForm] = useState<Record<string, { value: string; value_type: string }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValueType, setNewValueType] = useState('text');

  const loadBlocks = async (page: string) => {
    const res = await adminFetch(`/api/admin/content/${page}`);
    if (res.ok) {
      const data: ContentBlock[] = await res.json();
      const formData: Record<string, { value: string; value_type: string }> = {};
      for (const b of data) {
        formData[b.key] = { value: b.value, value_type: b.value_type };
      }
      setForm(formData);
    }
  };

  useEffect(() => {
    loadBlocks(activePage);
    setSaved(false);
  }, [activePage]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const blockArray = Object.entries(form).map(([key, data]) => ({
      key,
      value: data.value,
      value_type: data.value_type,
    }));

    const res = await adminFetch(`/api/admin/content/${activePage}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks: blockArray }),
    });

    if (res.ok) {
      setSaved(true);
      loadBlocks(activePage);
    }
    setSaving(false);
  };

  const addField = () => {
    const key = newKey.trim().toLowerCase().replace(/\s+/g, '_');
    if (!key || form[key]) return;
    setForm({ ...form, [key]: { value: '', value_type: newValueType } });
    setNewKey('');
  };

  const removeField = (key: string) => {
    const updated = { ...form };
    delete updated[key];
    setForm(updated);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Content Blocks</h1>

      {/* Page Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {PAGES.map((p) => (
          <button
            key={p.value}
            onClick={() => setActivePage(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activePage === p.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Content Fields */}
      <div className="bg-white rounded-xl border p-6 space-y-5 mb-6">
        {Object.keys(form).length === 0 && (
          <p className="text-gray-400 text-sm">
            No content blocks for this page yet. Add fields below.
          </p>
        )}

        {Object.entries(form).map(([key, data]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">{humanLabel(key)}</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono">{key}</span>
                <button
                  onClick={() => removeField(key)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
            {data.value_type === 'richtext' ? (
              <textarea
                value={data.value}
                onChange={(e) =>
                  setForm({ ...form, [key]: { ...data, value: e.target.value } })
                }
                rows={5}
                className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
              />
            ) : data.value_type === 'image_url' ? (
              <div className="space-y-2">
                <input
                  value={data.value}
                  onChange={(e) =>
                    setForm({ ...form, [key]: { ...data, value: e.target.value } })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {data.value && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.value}
                    alt={key}
                    className="h-20 object-cover rounded-lg"
                  />
                )}
              </div>
            ) : (
              <input
                value={data.value}
                onChange={(e) =>
                  setForm({ ...form, [key]: { ...data, value: e.target.value } })
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            )}
          </div>
        ))}
      </div>

      {/* Add New Field */}
      <div className="bg-gray-50 rounded-xl border p-4 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Add New Content Field</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Key</label>
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. hero_title"
              className="px-3 py-2 border rounded-lg text-sm w-48"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={newValueType}
              onChange={(e) => setNewValueType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="text">Text</option>
              <option value="richtext">Rich Text</option>
              <option value="image_url">Image URL</option>
            </select>
          </div>
          <button
            onClick={addField}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
          >
            + Add Field
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 font-medium">✓ Saved successfully</span>
        )}
      </div>
    </div>
  );
}
