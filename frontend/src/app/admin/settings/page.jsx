"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Loader2, Save, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    facebookUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    assessment_price: process.env.NEXT_PUBLIC_ASSESSMENT_PRICE || '199',
    currency: process.env.NEXT_PUBLIC_CURRENCY || 'INR',
    payment_enabled: 'true',
    razorpay_mode: 'live',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    assessment_active: 'true',
    invoice_prefix: 'SSC',
    refund_window_days: '7',
    certificate_enabled: 'true',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const fetchSettings = async () => {
    try {
      const res = await adminApi.getSettings();
      const settingsObj = {};
      res.data.forEach(item => {
        settingsObj[item.key] = item.value;
      });
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
    setSaveStatus(null);
    try {
      const settingsArray = Object.keys(settings).map(key => ({
        key,
        value: settings[key],
      }));
      await adminApi.batchUpdateSettings(settingsArray);
      setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Failed to save settings: ' + err.message });
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

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'payment', label: 'Payment Settings' },
    { id: 'certificate', label: 'Certificate' },
    { id: 'social', label: 'Social Links' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
              <p className="mt-2 text-slate-600 max-w-2xl">Manage SSC platform configuration for payments, certificates, and public information.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Status Messages */}
          {saveStatus && (
            <div className={`mx-6 mt-6 p-4 rounded-lg border-2 flex items-center gap-3 ${
              saveStatus.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              {saveStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              )}
              <span className={saveStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {saveStatus.message}
              </span>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <section className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Site Information</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                      <input 
                        type="text" 
                        value={settings.siteName}
                        onChange={(e) => handleChange('siteName', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Seemanchal SmartVyapaar Consultancy"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone</label>
                      <input
                        type="text"
                        value={settings.contactPhone}
                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Physical Address</label>
                      <textarea
                        rows={3}
                        value={settings.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'payment' && (
              <section className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Assessment Configuration</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">Configure your assessment pricing and availability settings.</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Assessment Fee (₹)</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={settings.assessment_price}
                        onChange={(e) => handleChange('assessment_price', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <p className="text-xs text-slate-500 mt-1">Amount charged per assessment attempt</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={settings.assessment_active === 'true'}
                          onChange={(e) => handleChange('assessment_active', e.target.checked ? 'true' : 'false')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Assessment Active</span>
                      </label>
                      <p className="text-xs text-slate-500 ml-7">Students can register for assessment</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Razorpay Configuration</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-amber-900">These keys are used for processing payments. Keep them secure.</p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Razorpay Mode</label>
                      <select
                        value={settings.razorpay_mode}
                        onChange={(e) => handleChange('razorpay_mode', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="test">Test Mode</option>
                        <option value="live">Live Mode</option>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">Use test mode for development</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={settings.payment_enabled === 'true'}
                          onChange={(e) => handleChange('payment_enabled', e.target.checked ? 'true' : 'false')}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Enable Payment Processing</span>
                      </label>
                      <p className="text-xs text-slate-500 ml-7">Allow students to pay for assessments</p>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Razorpay Key ID</label>
                      <input
                        type="password"
                        value={settings.razorpay_key_id}
                        onChange={(e) => handleChange('razorpay_key_id', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm"
                        placeholder="key_XXXXXXXXXXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Razorpay Key Secret</label>
                      <input
                        type="password"
                        value={settings.razorpay_key_secret}
                        onChange={(e) => handleChange('razorpay_key_secret', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono text-sm"
                        placeholder="secret_XXXXXXXXXXXXXXXXXXXXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Refund Policy</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Refund Window (Days)</label>
                      <input
                        type="number"
                        min="0"
                        value={settings.refund_window_days}
                        onChange={(e) => handleChange('refund_window_days', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <p className="text-xs text-slate-500 mt-1">Days within which refunds are allowed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Prefix</label>
                      <input
                        type="text"
                        value={settings.invoice_prefix}
                        onChange={(e) => handleChange('invoice_prefix', e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="SSC"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Certificate Tab */}
            {activeTab === 'certificate' && (
              <section className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Certificate Settings</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900">Configure certificate generation and issuance policies.</p>
                </div>
                <div>
                  <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.certificate_enabled === 'true'}
                      onChange={(e) => handleChange('certificate_enabled', e.target.checked ? 'true' : 'false')}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Enable Certificate Issuance</span>
                  </label>
                  <p className="text-xs text-slate-500 ml-7 mt-1">Automatically issue certificates to students who pass</p>
                </div>
              </section>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <section className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">Social Media Links</h3>
                <p className="text-sm text-slate-600">Add your social media profiles for easy access from the website.</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Facebook URL</label>
                    <input 
                      type="url" 
                      value={settings.facebookUrl}
                      onChange={(e) => handleChange('facebookUrl', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
                    <input 
                      type="url" 
                      value={settings.linkedinUrl}
                      onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Instagram URL</label>
                    <input 
                      type="url" 
                      value={settings.instagramUrl}
                      onChange={(e) => handleChange('instagramUrl', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Twitter/X URL</label>
                    <input 
                      type="url" 
                      value={settings.twitterUrl}
                      onChange={(e) => handleChange('twitterUrl', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
