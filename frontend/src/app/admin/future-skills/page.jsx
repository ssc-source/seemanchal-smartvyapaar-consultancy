'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { Search, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const STATUS_BADGES = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Contacted', className: 'bg-amber-100 text-amber-800' },
  meeting_scheduled: { label: 'Meeting Scheduled', className: 'bg-cyan-100 text-cyan-800' },
  proposal_sent: { label: 'Proposal Sent', className: 'bg-violet-100 text-violet-800' },
  negotiation: { label: 'Negotiation', className: 'bg-orange-100 text-orange-800' },
  converted: { label: 'Converted', className: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rejected', className: 'bg-slate-100 text-slate-800' },
};

const STATUS_OPTIONS = [
  'new',
  'contacted',
  'meeting_scheduled',
  'proposal_sent',
  'negotiation',
  'converted',
  'rejected',
];

export default function AdminFutureSkills() {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await adminApi.getFutureSkillsInquiries();
      setInquiries(res.data || []);
    } catch (err) {
      console.error('[AdminFutureSkills] fetch error', err);
      setInquiries([]);
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSelect = (inquiry) => {
    setSelectedInquiry(inquiry);
    setNotesDraft(inquiry.notes || '');
  };

  const updateInquiry = async (id, updates) => {
    try {
      if (updates.status) setSavingStatus(true);
      if (updates.notes !== undefined) setSavingNotes(true);
      const res = await adminApi.updateFutureSkillsInquiry(id, updates);
      const updated = res.data;
      setInquiries((prev) => prev.map(item => item.id === id ? updated : item));
      if (selectedInquiry?.id === id) setSelectedInquiry(updated);
    } catch (err) {
      alert(err.message || 'Failed to update inquiry');
    } finally {
      setSavingStatus(false);
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    try {
      await adminApi.deleteFutureSkillsInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } catch (err) {
      alert(err.message || 'Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const query = search.toLowerCase();
    return (
      inquiry.schoolName?.toLowerCase().includes(query) ||
      inquiry.principalName?.toLowerCase().includes(query) ||
      inquiry.email?.toLowerCase().includes(query) ||
      inquiry.city?.toLowerCase().includes(query) ||
      inquiry.state?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="w-1/2 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No inquiries found</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredInquiries.map((inquiry) => {
                const badge = STATUS_BADGES[inquiry.status] || STATUS_BADGES.new;
                return (
                  <div
                    key={inquiry.id}
                    onClick={() => handleSelect(inquiry)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedInquiry?.id === inquiry.id ? 'bg-slate-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-slate-900">{inquiry.schoolName}</h4>
                        <p className="text-sm text-slate-500">{inquiry.principalName} • {inquiry.email}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{inquiry.city}, {inquiry.state}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-slate-400">{new Date(inquiry.createdAt).toLocaleString()}</p>
                      {inquiry.proposalDownloaded && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium border border-blue-100">
                          📄 Downloaded ({inquiry.proposalDownloadCount})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto">
        {selectedInquiry ? (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedInquiry.schoolName}</h2>
                <p className="text-sm text-slate-500">{selectedInquiry.principalName}</p>
                <a href={`mailto:${selectedInquiry.email}`} className="text-slate-600 text-sm hover:underline">{selectedInquiry.email}</a>
                <p className="text-sm text-slate-500 mt-1">{selectedInquiry.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Board Type</p>
                <p className="text-sm text-slate-800">{selectedInquiry.boardType?.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Student Strength</p>
                <p className="text-sm text-slate-800">{selectedInquiry.studentStrength ?? 'Not provided'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Classes Covered</p>
                <p className="text-sm text-slate-800">{Array.isArray(selectedInquiry.classesCovered) && selectedInquiry.classesCovered.length > 0 ? selectedInquiry.classesCovered.join(', ') : 'Not provided'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Interested Programs</p>
                <p className="text-sm text-slate-800">{Array.isArray(selectedInquiry.interestedPrograms) && selectedInquiry.interestedPrograms.length > 0 ? selectedInquiry.interestedPrograms.join(', ') : 'Not provided'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Source</p>
                <p className="text-sm text-slate-800">{selectedInquiry.source || 'website'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Proposal Downloaded</p>
                <p className="text-sm text-slate-800 font-medium">
                  {selectedInquiry.proposalDownloaded ? (
                    <span className="text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-green-100">Yes</span>
                  ) : (
                    <span className="text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs font-semibold">No</span>
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Proposal Download Count</p>
                <p className="text-sm text-slate-800 font-semibold">{selectedInquiry.proposalDownloadCount ?? 0}</p>
              </div>
              {selectedInquiry.proposalDownloaded && (
                <div className="rounded-2xl bg-slate-50 p-4 col-span-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Proposal Last Downloaded At</p>
                  <p className="text-sm text-slate-800">
                    {selectedInquiry.proposalDownloadedAt ? new Date(selectedInquiry.proposalDownloadedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  value={selectedInquiry.status}
                  onChange={(e) => updateInquiry(selectedInquiry.id, { status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                  ))}
                </select>
                {savingStatus && <p className="text-xs text-slate-500 mt-2">Saving status...</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Admin Notes</label>
                <textarea
                  rows={5}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  onBlur={async () => {
                    if (notesDraft !== (selectedInquiry.notes || '')) {
                      await updateInquiry(selectedInquiry.id, { notes: notesDraft });
                    }
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                {savingNotes && <p className="text-xs text-slate-500 mt-2">Saving notes...</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Message</h3>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                  {selectedInquiry.message || 'No message provided.'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-2">Designation</h3>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedInquiry.designation || 'Not provided'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <CheckCircle className="h-12 w-12 mb-4 text-slate-200" />
            <p>Select an inquiry to review details, update status, or add follow-up notes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
