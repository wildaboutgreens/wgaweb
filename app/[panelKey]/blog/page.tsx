'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import ImageField from '@/components/admin/ImageField';

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt_text?: string | null;
  post_type: 'article' | 'recipe';
  is_published: boolean;
  show_on_homepage: boolean;
  published_at: string | null;
  created_at: string;
  recipe_ingredients?: string[] | null;
  recipe_method_steps?: string[] | null;
  recipe_prep_time?: string | null;
  recipe_cook_time?: string | null;
  recipe_difficulty?: string | null;
  recipe_serves?: string | null;
  recipe_categories?: string[] | null;
}

const emptyPost = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  cover_image_url: '',
  cover_image_alt_text: '',
  post_type: 'article' as 'article' | 'recipe',
  is_published: false,
  show_on_homepage: false,
  recipe_ingredients: [] as string[],
  recipe_method_steps: [] as string[],
  recipe_prep_time: '',
  recipe_cook_time: '',
  recipe_difficulty: '',
  recipe_serves: '',
  recipe_categories: [] as string[],
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [newCatInput, setNewCatInput] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'article' | 'recipe'>('all');

  const loadPosts = useCallback(async () => {
    const url = filterType === 'all' ? '/api/admin/blog' : `/api/admin/blog?type=${filterType}`;
    const res = await adminFetch(url);
    if (res.ok) setPosts(await res.json());
  }, [filterType]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const openEdit = async (id: string) => {
    const res = await adminFetch(`/api/admin/blog/${id}`);
    if (res.ok) {
      const data = await res.json();
      setEditing(data);
      setForm({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || '',
        cover_image_url: data.cover_image_url || '',
        cover_image_alt_text: data.cover_image_alt_text || '',
        post_type: data.post_type || 'article',
        is_published: data.is_published,
        show_on_homepage: data.show_on_homepage || false,
        recipe_ingredients: Array.isArray(data.recipe_ingredients) ? data.recipe_ingredients : [],
        recipe_method_steps: Array.isArray(data.recipe_method_steps) ? data.recipe_method_steps : [],
        recipe_prep_time: data.recipe_prep_time || '',
        recipe_cook_time: data.recipe_cook_time || '',
        recipe_difficulty: data.recipe_difficulty || '',
        recipe_serves: data.recipe_serves || '',
        recipe_categories: Array.isArray(data.recipe_categories) ? data.recipe_categories : [],
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        recipe_ingredients: form.post_type === 'recipe' ? form.recipe_ingredients.filter(s => s.trim().length > 0) : [],
        recipe_method_steps: form.post_type === 'recipe' ? form.recipe_method_steps.filter(s => s.trim().length > 0) : [],
        recipe_categories: form.post_type === 'recipe' ? form.recipe_categories.filter(s => s.trim().length > 0) : [],
      };
      if (isNew) {
        const res = await adminFetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsNew(false);
          setEditing(null);
          loadPosts();
        }
      } else if (editing) {
        const res = await adminFetch(`/api/admin/blog/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setEditing(null);
          loadPosts();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await adminFetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    setEditing(null);
    loadPosts();
  };

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
          {isNew ? 'New Post' : `Edit: ${editing?.title}`}
        </h1>

        <div className="bg-white rounded-xl border p-6 space-y-4">
          {/* Post Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="post_type"
                  value="article"
                  checked={form.post_type === 'article'}
                  onChange={() => setForm({ ...form, post_type: 'article' })}
                  className="text-green-600 focus:ring-green-500"
                />
                <span>Article (Journal)</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="post_type"
                  value="recipe"
                  checked={form.post_type === 'recipe'}
                  onChange={() => setForm({ ...form, post_type: 'recipe' })}
                  className="text-green-600 focus:ring-green-500"
                />
                <span>Recipe (Recipe Khazana)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {form.post_type === 'recipe' ? 'Introduction / Story' : 'Content'}
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={form.post_type === 'recipe' ? 5 : 10}
              className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
            />
          </div>
          <div>
            <ImageField
              value={form.cover_image_url || null}
              onChange={(url) => setForm({ ...form, cover_image_url: url })}
              label="Cover Image"
              aspectRatio="16/9"
              folder={`blog/${form.slug?.trim() || editing?.slug || 'new-post'}/cover`}
              publicId="cover"
              altText={form.cover_image_alt_text || ''}
              onAltTextChange={(alt) => setForm({ ...form, cover_image_alt_text: alt })}
            />
          </div>

          {/* Recipe-specific Fields */}
          {form.post_type === 'recipe' && (
            <div className="border-t pt-6 mt-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>🍳</span> Recipe Details
              </h2>

              {/* Prep / Cook / Difficulty / Serves */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 mins"
                    value={form.recipe_prep_time}
                    onChange={(e) => setForm({ ...form, recipe_prep_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Cook Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 20 mins"
                    value={form.recipe_cook_time}
                    onChange={(e) => setForm({ ...form, recipe_cook_time: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Difficulty</label>
                  <input
                    type="text"
                    placeholder="e.g. Easy"
                    value={form.recipe_difficulty}
                    onChange={(e) => setForm({ ...form, recipe_difficulty: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Serves</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-4"
                    value={form.recipe_serves}
                    onChange={(e) => setForm({ ...form, recipe_serves: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Recipe Categories */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Recipe Categories (press Enter to add)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.recipe_categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 text-xs font-medium rounded-full border border-amber-200"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => {
                          const next = form.recipe_categories.filter((_, i) => i !== idx);
                          setForm({ ...form, recipe_categories: next });
                        }}
                        className="hover:text-red-600 font-bold ml-1 text-sm leading-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Breakfast, Salads, Lunch"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = newCatInput.trim();
                        if (val && !form.recipe_categories.includes(val)) {
                          setForm({
                            ...form,
                            recipe_categories: [...form.recipe_categories, val],
                          });
                          setNewCatInput('');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = newCatInput.trim();
                      if (val && !form.recipe_categories.includes(val)) {
                        setForm({
                          ...form,
                          recipe_categories: [...form.recipe_categories, val],
                        });
                        setNewCatInput('');
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-lg"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Ingredients List */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Ingredients (You Will Need)
                </label>
                <div className="space-y-2">
                  {form.recipe_ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono w-6 text-right">•</span>
                      <input
                        type="text"
                        placeholder="e.g. 2 skinless chicken breasts"
                        value={ing}
                        onChange={(e) => {
                          const next = [...form.recipe_ingredients];
                          next[idx] = e.target.value;
                          setForm({ ...form, recipe_ingredients: next });
                        }}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = form.recipe_ingredients.filter((_, i) => i !== idx);
                          setForm({ ...form, recipe_ingredients: next });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded text-sm"
                        title="Remove ingredient"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      ...form,
                      recipe_ingredients: [...form.recipe_ingredients, ''],
                    });
                  }}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  + Add Ingredient
                </button>
              </div>

              {/* Method Steps List */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Method Steps
                </label>
                <div className="space-y-3">
                  {form.recipe_method_steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded mt-1">
                        {idx + 1}
                      </span>
                      <textarea
                        rows={2}
                        placeholder={`Step ${idx + 1} instructions...`}
                        value={step}
                        onChange={(e) => {
                          const next = [...form.recipe_method_steps];
                          next[idx] = e.target.value;
                          setForm({ ...form, recipe_method_steps: next });
                        }}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = form.recipe_method_steps.filter((_, i) => i !== idx);
                          setForm({ ...form, recipe_method_steps: next });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded text-sm mt-1"
                        title="Remove step"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      ...form,
                      recipe_method_steps: [...form.recipe_method_steps, ''],
                    });
                  }}
                  className="mt-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  + Add Step
                </button>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm pt-2">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.show_on_homepage}
              onChange={(e) => setForm({ ...form, show_on_homepage: e.target.checked })}
            />
            Show on Homepage
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Post'}
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog &amp; Recipes</h1>
          <p className="text-xs text-gray-500 mt-1">Manage articles and Recipe Khazana entries</p>
        </div>
        <button
          onClick={() => {
            setIsNew(true);
            setForm(emptyPost);
          }}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 self-start sm:self-auto"
        >
          + New Post
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterType === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({posts.length})
        </button>
        <button
          onClick={() => setFilterType('article')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterType === 'article'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Articles
        </button>
        <button
          onClick={() => setFilterType('recipe')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterType === 'recipe'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Recipes
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-gray-50">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      p.post_type === 'recipe'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {p.post_type === 'recipe' ? '🍳 Recipe' : '📰 Article'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.is_published ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => openEdit(p.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="p-6 text-center text-gray-400">No posts found</p>}
      </div>
    </div>
  );
}
