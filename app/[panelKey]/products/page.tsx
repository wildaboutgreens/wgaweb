'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import { formatPrice } from '@/lib/format';
import ImageField from '@/components/admin/ImageField';

interface Variant {
  id: string;
  label: string;
  net_weight_grams: number;
  price_paise: number;
  stock_qty: number;
  is_active: boolean;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  cloudinary_public_id?: string | null;
  created_at?: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  nutrition_notes: string | null;
  thumbnail_url: string | null;
  tags: string[];
  is_bundle: boolean;
  is_active: boolean;
  variants?: Variant[];
  images?: ProductImage[];
}

const emptyProduct = {
  name: '',
  slug: '',
  category: '',
  description: '',
  nutrition_notes: '',
  thumbnail_url: '',
  tags: [] as string[],
  is_bundle: false,
  is_active: true,
};

const emptyVariant = {
  label: '',
  net_weight_grams: 0,
  price_paise: 0,
  stock_qty: 0,
  is_active: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [tagString, setTagString] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variantForm, setVariantForm] = useState(emptyVariant);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    const res = await adminFetch('/api/admin/products');
    if (res.ok) setProducts(await res.json());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProduct = async (id: string) => {
    const res = await adminFetch(`/api/admin/products/${id}`);
    if (res.ok) {
      const data = await res.json();
      setEditing(data);
      setForm({
        name: data.name || '',
        slug: data.slug || '',
        category: data.category || '',
        description: data.description || '',
        nutrition_notes: data.nutrition_notes || '',
        thumbnail_url: data.thumbnail_url || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        is_bundle: data.is_bundle ?? false,
        is_active: data.is_active ?? true,
      });
      setTagString(Array.isArray(data.tags) ? data.tags.join(', ') : '');
      setVariants(data.variants || []);
      setImages(data.images || []);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedTags = tagString
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...form,
        tags: parsedTags,
      };

      if (isNew) {
        const res = await adminFetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsNew(false);
          setEditing(null);
          loadProducts();
        }
      } else if (editing) {
        const res = await adminFetch(`/api/admin/products/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          loadProducts();
          loadProduct(editing.id);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setEditing(null);
    loadProducts();
  };

  const handleVariantSave = async (v: Variant) => {
    await adminFetch(`/api/admin/variants/${v.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: v.label,
        net_weight_grams: v.net_weight_grams,
        price_paise: v.price_paise,
        stock_qty: v.stock_qty,
        is_active: v.is_active,
      }),
    });
    if (editing) loadProduct(editing.id);
  };

  const handleVariantCreate = async () => {
    if (!editing) return;
    const res = await adminFetch(`/api/admin/products/${editing.id}/variants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(variantForm),
    });
    if (res.ok) {
      setVariantForm(emptyVariant);
      setShowVariantForm(false);
      loadProduct(editing.id);
    }
  };

  const handleVariantDelete = async (vid: string) => {
    if (!confirm('Deactivate this variant?')) return;
    await adminFetch(`/api/admin/variants/${vid}`, { method: 'DELETE' });
    if (editing) loadProduct(editing.id);
  };

  // ── Editing/creating view ──
  if (editing || isNew) {
    return (
      <div>
        <button
          onClick={() => {
            setEditing(null);
            setIsNew(false);
          }}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          &larr; Back to list
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isNew ? 'Add Product' : `Edit: ${editing?.name}`}
        </h1>

        <div className="bg-white rounded-xl border p-6 space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                value={tagString}
                onChange={(e) => setTagString(e.target.value)}
                placeholder="e.g. spicy, salad, bundle"
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Thumbnail upload field */}
          <div>
            <ImageField
              value={form.thumbnail_url || null}
              onChange={(url) => setForm((prev) => ({ ...prev, thumbnail_url: url }))}
              label="Product Thumbnail"
              aspectRatio="1/1"
              folder={`products/${form.slug?.trim() || editing?.slug || 'new-product'}/thumbnail`}
              publicId="thumbnail"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nutrition Notes</label>
            <textarea
              value={form.nutrition_notes}
              onChange={(e) => setForm({ ...form, nutrition_notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_bundle}
                onChange={(e) => setForm({ ...form, is_bundle: e.target.checked })}
              />
              Bundle
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            {!isNew && editing && (
              <button
                onClick={() => handleDelete(editing.id)}
                className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100"
              >
                Deactivate
              </button>
            )}
          </div>
        </div>

        {/* Gallery section */}
        {!isNew && editing && (
          <div className="bg-white rounded-xl border p-6 mb-6">
            <div className="mb-4">
              <h2 className="font-bold text-gray-900">Product Image Gallery</h2>
              <p className="text-xs text-gray-500">
                Multiple images for the public product detail gallery / carousel
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="border rounded-xl p-2 bg-gray-50 flex flex-col justify-between space-y-2 shadow-sm"
                >
                  <ImageField
                    value={img.image_url}
                    onChange={async (url, publicId) => {
                      await adminFetch(`/api/admin/images/${img.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          image_url: url,
                          cloudinary_public_id: publicId,
                        }),
                      });
                      loadProduct(editing.id);
                    }}
                    aspectRatio="1/1"
                    folder={`products/${form.slug?.trim() || editing.slug || 'product'}/gallery`}
                  />
                  <div className="flex items-center justify-between gap-1 pt-1 border-t">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-500 font-medium">Order:</span>
                      <input
                        type="number"
                        defaultValue={img.display_order}
                        onBlur={async (e) => {
                          const newOrder = parseInt(e.target.value, 10);
                          if (!isNaN(newOrder) && newOrder !== img.display_order) {
                            await adminFetch(`/api/admin/images/${img.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ display_order: newOrder }),
                            });
                            loadProduct(editing.id);
                          }
                        }}
                        className="w-12 px-1 py-0.5 border rounded text-xs text-center bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm('Delete this gallery image?')) return;
                        await adminFetch(`/api/admin/images/${img.id}`, { method: 'DELETE' });
                        loadProduct(editing.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold px-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty ImageField to add a new gallery image */}
              <div className="border rounded-xl p-2 bg-gray-50 shadow-sm">
                <ImageField
                  value={null}
                  onChange={async (url, publicId) => {
                    const addRes = await adminFetch(`/api/admin/products/${editing.id}/images`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        image_url: url,
                        display_order: images.length,
                        cloudinary_public_id: publicId,
                      }),
                    });
                    if (addRes.ok) {
                      loadProduct(editing.id);
                    }
                  }}
                  aspectRatio="1/1"
                  folder={`products/${form.slug?.trim() || editing.slug || 'product'}/gallery`}
                />
                <p className="text-[11px] text-gray-400 text-center mt-1">+ Add Image</p>
              </div>
            </div>
          </div>
        )}

        {/* Variants section */}
        {!isNew && (
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Variants</h2>
              <button
                onClick={() => setShowVariantForm(true)}
                className="px-3 py-1 bg-gray-100 text-sm rounded-lg hover:bg-gray-200"
              >
                + Add Variant
              </button>
            </div>

            {showVariantForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    placeholder="Label (e.g. 100g Tray)"
                    value={variantForm.label}
                    onChange={(e) => setVariantForm({ ...variantForm, label: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Weight (g)"
                    value={variantForm.net_weight_grams || ''}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, net_weight_grams: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price (paise)"
                    value={variantForm.price_paise || ''}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, price_paise: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={variantForm.stock_qty || ''}
                    onChange={(e) =>
                      setVariantForm({ ...variantForm, stock_qty: Number(e.target.value) })
                    }
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleVariantCreate}
                    className="px-3 py-1 bg-gray-900 text-white text-sm rounded-lg"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowVariantForm(false)}
                    className="px-3 py-1 text-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Label</th>
                  <th className="pb-2">Weight</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Stock</th>
                  <th className="pb-2">Active</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <VariantRow
                    key={v.id}
                    variant={v}
                    onSave={handleVariantSave}
                    onDelete={handleVariantDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ── Product list view ──
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => {
            setIsNew(true);
            setForm(emptyProduct);
          }}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-gray-50">
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {p.thumbnail_url ? (
                    <img
                      src={p.thumbnail_url}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-lg border bg-white"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-400 border">
                      🌿
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">
                  {p.category.replace(/-/g, ' ')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.tags && p.tags.length > 0 ? (
                      p.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => loadProduct(p.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-gray-400">No products yet</p>}
      </div>
    </div>
  );
}

// ── Inline variant editor row ──
function VariantRow({
  variant,
  onSave,
  onDelete,
}: {
  variant: Variant;
  onSave: (v: Variant) => void;
  onDelete: (id: string) => void;
}) {
  const [v, setV] = useState(variant);
  const changed =
    v.label !== variant.label ||
    v.price_paise !== variant.price_paise ||
    v.stock_qty !== variant.stock_qty ||
    v.is_active !== variant.is_active;

  return (
    <tr className="border-b last:border-0">
      <td className="py-2">
        <input
          value={v.label}
          onChange={(e) => setV({ ...v, label: e.target.value })}
          className="px-2 py-1 border rounded text-sm w-full"
        />
      </td>
      <td className="py-2 text-gray-500">{v.net_weight_grams}g</td>
      <td className="py-2">
        <input
          type="number"
          value={v.price_paise}
          onChange={(e) => setV({ ...v, price_paise: Number(e.target.value) })}
          className="px-2 py-1 border rounded text-sm w-20"
        />{' '}
        <span className="text-gray-400 text-xs">({formatPrice(v.price_paise)})</span>
      </td>
      <td className="py-2">
        <input
          type="number"
          value={v.stock_qty}
          onChange={(e) => setV({ ...v, stock_qty: Number(e.target.value) })}
          className="px-2 py-1 border rounded text-sm w-16"
        />
      </td>
      <td className="py-2">
        <input
          type="checkbox"
          checked={v.is_active}
          onChange={(e) => setV({ ...v, is_active: e.target.checked })}
        />
      </td>
      <td className="py-2 space-x-2">
        {changed && (
          <button onClick={() => onSave(v)} className="text-blue-600 hover:text-blue-800 text-xs">
            Save
          </button>
        )}
        <button onClick={() => onDelete(v.id)} className="text-red-500 hover:text-red-700 text-xs">
          Delete
        </button>
      </td>
    </tr>
  );
}
