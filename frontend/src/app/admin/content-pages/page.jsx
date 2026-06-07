"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";

export default function AdminContentPages() {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "{}",
    displayOrder: 0,
    status: true,
  });

  const fetchPages = async () => {
    try {
      const res = await adminApi.getContentPages();
      setPages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page) => {
    setIsEditing(page.id);
    setFormData({
      title: page.title || "",
      slug: page.slug || "",
      content: JSON.stringify(page.content || {}, null, 2),
      displayOrder: page.displayOrder || 0,
      status: page.status === 'published',
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ title: "", slug: "", content: "{}", displayOrder: 0, status: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        status: formData.status ? 'published' : 'draft',
        content: JSON.parse(formData.content || '{}'),
      };

      if (isEditing) {
        await adminApi.updateContentPage(isEditing, payload);
      } else {
        const createPayload = { ...payload };
        if (!createPayload.slug) {
          createPayload.slug = createPayload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        await adminApi.createContentPage(createPayload);
      }

      resetForm();
      fetchPages();
    } catch (err) {
      alert(err.message || "Failed to save content page.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this content page?")) {
      try {
        await adminApi.deleteContentPage(id);
        fetchPages();
      } catch (err) {
        alert(err.message || "Failed to delete content page.");
      }
    }
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(search.toLowerCase()) ||
    page.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6">
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h3 className="font-semibold text-slate-800">Manage Content Pages</h3>
            <p className="text-sm text-slate-500">Create, edit, and publish static content pages.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-80"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPages.map((page) => (
              <div key={page.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-slate-900 flex items-center gap-2">
                    {page.title}
                    <span className="text-xs rounded-full px-2 py-1 font-medium text-slate-600 bg-slate-100">
                      {page.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-500">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(page)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(page.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredPages.length === 0 && (
              <div className="p-8 text-slate-500">No pages matched your search.</div>
            )}
          </div>
        )}
      </div>

      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <div className="mb-6 border-b pb-2">
          <h3 className="font-semibold text-slate-800">{isEditing ? "Edit Content Page" : "Add New Content Page"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (JSON)</label>
            <textarea
              rows={8}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm font-mono"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent"
                />
                Published
              </label>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="submit" className="flex-1 bg-brand-primary text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
              {isEditing ? "Update" : "Create"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
