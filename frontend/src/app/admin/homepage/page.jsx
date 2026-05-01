"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

export default function AdminHomepageSections() {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    sectionKey: "", title: "", content: "", isActive: true
  });

  const fetchSections = async () => {
    try {
      const res = await adminApi.getHomepageSections();
      setSections(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleEdit = (section) => {
    setIsEditing(section.id);
    setFormData({
      sectionKey: section.sectionKey, 
      title: section.title || "", 
      content: JSON.stringify(section.content, null, 2), 
      isActive: section.isActive
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({ sectionKey: "", title: "", content: "{}", isActive: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsedContent = {};
      try {
        parsedContent = JSON.parse(formData.content);
      } catch {
        throw new Error("Invalid JSON in content");
      }

      const payload = {
        sectionKey: formData.sectionKey,
        title: formData.title,
        content: parsedContent,
        isActive: formData.isActive
      };

      if (isEditing) {
        await adminApi.updateHomepageSection(isEditing, payload);
      } else {
        await adminApi.createHomepageSection(payload);
      }
      resetForm();
      fetchSections();
    } catch (err) {
      alert(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this section?")) {
      try {
        await adminApi.deleteHomepageSection(id);
        fetchSections();
      } catch (err) {
        alert(err.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="flex gap-6">
      {/* List */}
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Manage Homepage Sections</h3>
          <button 
            onClick={resetForm}
            className="flex items-center gap-2 bg-brand-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-8 flex justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sections.map(s => (
              <div key={s.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-slate-900 flex items-center gap-2">
                    {s.title || s.sectionKey}
                    {!s.isActive && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Inactive</span>}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">Key: {s.sectionKey}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(s)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <h3 className="font-semibold text-slate-800 mb-6 border-b pb-2">
          {isEditing ? "Edit Section" : "Add New Section"}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section Key</label>
            <input 
              type="text" required
              value={formData.sectionKey} onChange={e => setFormData({...formData, sectionKey: e.target.value})}
              placeholder="e.g. hero, stats, cta"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title (optional)</label>
            <input 
              type="text"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content (JSON format)</label>
            <textarea 
              rows={10} required
              value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm font-mono"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input 
                  type="checkbox" 
                  checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent"
                />
                Is Active
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
