'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import ImageField from '@/components/admin/ImageField';

interface Slide {
  id: string;
  image_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  carousel_key: string;
  cloudinary_public_id?: string | null;
  created_at: string;
}

const emptySlide = {
  image_url: '',
  link_url: '',
  display_order: 0,
  is_active: true,
  carousel_key: '',
  cloudinary_public_id: '',
};

export default function AdminCarouselPage() {
  const [allSlides, setAllSlides] = useState<Slide[]>([]);
  const [carouselKeys, setCarouselKeys] = useState<string[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState(emptySlide);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const loadSlides = useCallback(async () => {
    const res = await adminFetch('/api/admin/carousel');
    if (res.ok) {
      const data: Slide[] = await res.json();
      setAllSlides(data);
      const keys = Array.from(new Set(data.map((s) => s.carousel_key))).sort();
      setCarouselKeys(keys);
      if (!activeKey && keys.length > 0) {
        setActiveKey(keys[0]);
      }
    }
  }, [activeKey]);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  const filteredSlides = allSlides
    .filter((s) => s.carousel_key === activeKey)
    .sort((a, b) => a.display_order - b.display_order);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        display_order: Number(form.display_order),
        carousel_key: form.carousel_key || activeKey,
      };
      if (isNew) {
        const res = await adminFetch('/api/admin/carousel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsNew(false);
          setForm(emptySlide);
          loadSlides();
        }
      } else if (editing) {
        const res = await adminFetch(`/api/admin/carousel/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setEditing(null);
          setForm(emptySlide);
          loadSlides();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    await adminFetch(`/api/admin/carousel/${id}`, { method: 'DELETE' });
    loadSlides();
  };

  const addCarouselKey = () => {
    const key = newKeyName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!key || carouselKeys.includes(key)) return;
    setCarouselKeys([...carouselKeys, key]);
    setActiveKey(key);
    setNewKeyName('');
  };

  // Editing / Creating view
  if (editing || isNew) {
    return (
      <div>
        <button
          onClick={() => {
            setEditing(null);
            setIsNew(false);
            setForm(emptySlide);
          }}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          &larr; Back to list
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isNew ? 'Add Slide' : 'Edit Slide'}
        </h1>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Carousel</label>
            <input
              value={form.carousel_key || activeKey}
              onChange={(e) => setForm({ ...form, carousel_key: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50"
              disabled={!!editing}
            />
          </div>
          <div>
            <ImageField
              value={form.image_url || null}
              onChange={(url, publicId) =>
                setForm({
                  ...form,
                  image_url: url,
                  cloudinary_public_id: publicId || form.cloudinary_public_id,
                })
              }
              label="Slide Image"
              aspectRatio="16/9"
              folder={`carousel/${form.carousel_key?.trim() || activeKey || 'homepage'}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link URL (optional)
              </label>
              <input
                value={form.link_url}
                onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !form.image_url}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Slide'}
            </button>
            {!isNew && editing && (
              <button
                onClick={() => handleDelete(editing.id)}
                className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Carousel Slides</h1>

      {/* Carousel key tabs */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {carouselKeys.map((k) => (
          <button
            key={k}
            onClick={() => setActiveKey(k)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeKey === k
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {k.replace(/_/g, ' ')}
          </button>
        ))}

        <div className="flex items-center gap-2 ml-2">
          <input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="New carousel key..."
            className="px-3 py-2 border rounded-lg text-sm w-44"
          />
          <button
            onClick={addCarouselKey}
            className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200"
          >
            + Carousel
          </button>
        </div>
      </div>

      {!activeKey ? (
        <p className="text-gray-400 text-sm">No carousels yet. Create one above.</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
              {activeKey.replace(/_/g, ' ')}
            </h2>
            <button
              onClick={() => {
                setIsNew(true);
                setForm({ ...emptySlide, carousel_key: activeKey });
              }}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
            >
              + Add Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSlides.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image_url} alt="Slide" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Order: {s.display_order}</span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        s.is_active
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(s);
                        setForm({
                          image_url: s.image_url,
                          link_url: s.link_url || '',
                          display_order: s.display_order,
                          is_active: s.is_active,
                          carousel_key: s.carousel_key,
                          cloudinary_public_id: s.cloudinary_public_id || '',
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredSlides.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No slides in this carousel yet. Add one above.
            </p>
          )}
        </>
      )}
    </div>
  );
}
