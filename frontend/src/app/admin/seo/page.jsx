"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, Edit2, Trash2, Search } from "lucide-react";

export default function AdminSeoManager() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    pageKey: "",
    pageType: "",
    entityId: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    robotsIndex: true,
    robotsFollow: true,
    structuredDataJson: "{}",
    status: true,
  });

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getSeoEntries();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item) => {
    setIsEditing(item.id);
    setFormData({
      pageKey: item.pageKey || "",
      pageType: item.pageType || "",
      entityId: item.entityId || "",
      metaTitle: item.title || "",
      metaDescription: item.description || "",
      metaKeywords: (item.structuredData && item.structuredData.metaKeywords) ? (item.structuredData.metaKeywords.join(", ")) : "",
      canonicalUrl: item.canonicalUrl || "",
      ogTitle: item.ogTitle || "",
      ogDescription: item.ogDescription || "",
      ogImage: item.ogImage || "",
      twitterTitle: item.structuredData?.twitterTitle || "",
      twitterDescription: item.structuredData?.twitterDescription || "",
      twitterImage: item.structuredData?.twitterImage || "",
      robotsIndex: !(item.robots || "").includes('noindex'),
      robotsFollow: !(item.robots || "").includes('nofollow'),
      structuredDataJson: JSON.stringify(item.structuredData || {}, null, 2),
      status: item.status === 'published',
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      pageKey: "",
      pageType: "",
      entityId: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      robotsIndex: true,
      robotsFollow: true,
      structuredDataJson: "{}",
      status: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        pageKey: formData.pageKey,
        title: formData.metaTitle || null,
        description: formData.metaDescription || null,
        canonicalUrl: formData.canonicalUrl || null,
        ogTitle: formData.ogTitle || null,
        ogDescription: formData.ogDescription || null,
        ogImage: formData.ogImage || null,
        robots: `${formData.robotsIndex ? 'index' : 'noindex'},${formData.robotsFollow ? 'follow' : 'nofollow'}`,
        structuredData: {},
        status: formData.status ? 'published' : 'draft',
      };

      // include keywords and twitter fields inside structuredData to avoid DB changes
      try {
        payload.structuredData = JSON.parse(formData.structuredDataJson || '{}');
      } catch (err) {
        payload.structuredData = {};
      }

      if (formData.metaKeywords) {
        payload.structuredData.metaKeywords = formData.metaKeywords.split(',').map(k => k.trim()).filter(Boolean);
      }
      if (formData.twitterTitle) payload.structuredData.twitterTitle = formData.twitterTitle;
      if (formData.twitterDescription) payload.structuredData.twitterDescription = formData.twitterDescription;
      if (formData.twitterImage) payload.structuredData.twitterImage = formData.twitterImage;

      if (isEditing) {
        await adminApi.updateSeoEntry(isEditing, payload);
      } else {
        if (!payload.pageKey) throw new Error('pageKey is required');
        await adminApi.createSeoEntry(payload);
      }

      resetForm();
      fetchItems();
    } catch (err) {
      alert(err.message || 'Failed to save SEO entry');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this SEO entry?')) return;
    try {
      await adminApi.deleteSeoEntry(id);
      fetchItems();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  const filtered = items.filter(it => (
    it.pageKey?.toLowerCase().includes(search.toLowerCase()) ||
    it.title?.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="flex gap-6">
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h3 className="font-semibold text-slate-800">SEO Manager</h3>
            <p className="text-sm text-slate-500">Manage per-page SEO metadata and open graph settings.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-80" />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(item => (
              <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-slate-900 flex items-center gap-2">{item.pageKey}
                    <span className="text-xs rounded-full px-2 py-1 font-medium text-slate-600 bg-slate-100">{item.status}</span>
                  </h4>
                  <p className="text-sm text-slate-500">{item.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={()=>handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-slate-500">No SEO entries found.</div>
            )}
          </div>
        )}
      </div>

      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <div className="mb-6 border-b pb-2">
          <h3 className="font-semibold text-slate-800">{isEditing ? 'Edit SEO Entry' : 'Create SEO Entry'}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Page Key</label>
            <input required value={formData.pageKey} onChange={(e)=>setFormData({...formData, pageKey: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
            <input value={formData.metaTitle} onChange={(e)=>setFormData({...formData, metaTitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
            <textarea rows={3} value={formData.metaDescription} onChange={(e)=>setFormData({...formData, metaDescription: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Keywords (comma separated)</label>
            <input value={formData.metaKeywords} onChange={(e)=>setFormData({...formData, metaKeywords: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Canonical URL</label>
            <input value={formData.canonicalUrl} onChange={(e)=>setFormData({...formData, canonicalUrl: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">OG Title</label>
            <input value={formData.ogTitle} onChange={(e)=>setFormData({...formData, ogTitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">OG Description</label>
            <textarea rows={2} value={formData.ogDescription} onChange={(e)=>setFormData({...formData, ogDescription: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">OG Image (URL)</label>
            <input value={formData.ogImage} onChange={(e)=>setFormData({...formData, ogImage: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Robots Index / Follow</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.robotsIndex} onChange={(e)=>setFormData({...formData, robotsIndex: e.target.checked})} /> Index</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={formData.robotsFollow} onChange={(e)=>setFormData({...formData, robotsFollow: e.target.checked})} /> Follow</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Structured Data (JSON)</label>
            <textarea rows={6} value={formData.structuredDataJson} onChange={(e)=>setFormData({...formData, structuredDataJson: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm font-mono" />
          </div>

          <div className="pt-2 flex gap-2">
            <button type="submit" className="flex-1 bg-brand-primary text-white py-2 rounded-lg">{isEditing ? 'Update' : 'Create'}</button>
            {isEditing && <button type="button" onClick={resetForm} className="px-4 bg-slate-100 text-slate-600 rounded-lg">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
