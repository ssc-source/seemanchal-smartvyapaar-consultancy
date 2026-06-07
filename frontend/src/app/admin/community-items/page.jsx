"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, Plus, Edit2, Trash2, Search } from "lucide-react";

export default function AdminCommunityItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    type: "GROUP",
    title: "",
    description: "",
    tags: "",
    icon: "",
    date: "",
    eventType: "",
    displayOrder: 0,
    status: true,
  });

  const fetchItems = async () => {
    try {
      const res = await adminApi.getCommunityItems();
      setItems(res.data);
    } catch (err) {
      console.error(err);
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
      type: item.type || "GROUP",
      title: item.title || "",
      description: item.description || "",
      tags: Array.isArray(item.metadata?.tags) ? item.metadata.tags.join(", ") : "",
      icon: item.metadata?.icon || "",
      date: item.metadata?.date || "",
      eventType: item.metadata?.eventType || "",
      displayOrder: item.displayOrder || 0,
      status: item.status === 'published',
    });
  };

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      type: "GROUP",
      title: "",
      description: "",
      tags: "",
      icon: "",
      date: "",
      eventType: "",
      displayOrder: 0,
      status: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        metadata: {
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          icon: formData.icon,
          date: formData.date,
          eventType: formData.eventType,
        },
        displayOrder: formData.displayOrder,
        status: formData.status ? 'published' : 'draft',
      };

      if (isEditing) {
        await adminApi.updateCommunityItem(isEditing, payload);
      } else {
        await adminApi.createCommunityItem(payload);
      }

      resetForm();
      fetchItems();
    } catch (err) {
      alert(err.message || "Failed to save community item.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this community item?")) {
      try {
        await adminApi.deleteCommunityItem(id);
        fetchItems();
      } catch (err) {
        alert(err.message || "Failed to delete community item.");
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6">
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <h3 className="font-semibold text-slate-800">Manage Community Items</h3>
            <p className="text-sm text-slate-500">Create and update community groups and events.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search community items..."
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
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div>
                  <h4 className="font-medium text-slate-900 flex items-center gap-2">
                    {item.title}
                    <span className="text-xs rounded-full px-2 py-1 font-medium text-slate-600 bg-slate-100">
                      {item.type}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-500">{item.metadata?.tags?.join(', ') || 'No tags'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="p-8 text-slate-500">No items matched your search.</div>
            )}
          </div>
        )}
      </div>

      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <div className="mb-6 border-b pb-2">
          <h3 className="font-semibold text-slate-800">{isEditing ? "Edit Community Item" : "Add New Community Item"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            >
              <option value="GROUP">GROUP</option>
              <option value="WORKSHOP">WORKSHOP</option>
              <option value="EVENT">EVENT</option>
            </select>
          </div>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Type</label>
              <input
                type="text"
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
              />
            </div>
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
