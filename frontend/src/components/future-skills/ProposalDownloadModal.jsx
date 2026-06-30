'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { AlertCircle, CheckCircle, Loader2, X, Download } from 'lucide-react';

export default function ProposalDownloadModal({ open, onOpenChange }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    principalName: '',
    schoolName: '',
    email: '',
    phone: '',
    schoolAddress: '',
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Form fields validation
    if (
      !formData.principalName.trim() ||
      !formData.schoolName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.schoolAddress.trim()
    ) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const blob = await api.submitFutureSkillsProposal(formData);
      setSuccess(true);
      
      // Automatically download PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.schoolName.trim().replace(/[^a-zA-Z0-9]/g, '_')}_Future_Skills_Proposal.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      // Reset form
      setFormData({
        principalName: '',
        schoolName: '',
        email: '',
        phone: '',
        schoolAddress: '',
      });

      // Wait 3 seconds in success state, then close modal
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 3000);
    } catch (err) {
      setError(err.message || 'An error occurred while generating the proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Download School Partnership Proposal
            </h2>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              Please provide your school details. A personalized proposal will be generated for your institution.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors ml-4 shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Your proposal is ready.</h3>
                <p className="text-sm text-green-600 mt-1 font-medium">Starting download...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Principal Name *
                </label>
                <input
                  type="text"
                  name="principalName"
                  value={formData.principalName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Dr. Ramesh Kumar"
                  className="w-full px-3.5 py-2 text-sm bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  School Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. St. Xavier's Academy"
                  className="w-full px-3.5 py-2 text-sm bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Official Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. contact@stxaviers.edu.in"
                  className="w-full px-3.5 py-2 text-sm bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2 text-sm bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  School Address *
                </label>
                <textarea
                  name="schoolAddress"
                  value={formData.schoolAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="e.g. KB Road, Araria, Bihar - 854311"
                  className="w-full px-3.5 py-2 text-sm bg-white text-gray-900 border border-gray-300 placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Proposal...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Generate Proposal</span>
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
