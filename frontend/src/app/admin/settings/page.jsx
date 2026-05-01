"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, Save } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    facebookUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    twitterUrl: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await adminApi.getSettings();
      // Convert array of {key, value} to object
      const settingsObj = {};
      res.data.forEach(item => {
        settingsObj[item.key] = item.value;
      });
      // Merge with default keys to ensure they exist
      setSettings(prev => ({ ...prev, ...settingsObj }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Convert object back to array of {key, value}
      const settingsArray = Object.keys(settings).map(key => ({
        key, value: settings[key]
      }));
      await adminApi.batchUpdateSettings(settingsArray);
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Global Settings</h2>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* General Information */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                  placeholder="Seemanchal SmartVyapaar Consultancy"
                />
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                <input 
                  type="email" 
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
                <input 
                  type="text" 
                  value={settings.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Physical Address</label>
                <textarea 
                  rows={2}
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Facebook URL</label>
                <input 
                  type="url" 
                  value={settings.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                <input 
                  type="url" 
                  value={settings.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Instagram URL</label>
                <input 
                  type="url" 
                  value={settings.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Twitter URL</label>
                <input 
                  type="url" 
                  value={settings.twitterUrl}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent focus:bg-white transition-colors"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
