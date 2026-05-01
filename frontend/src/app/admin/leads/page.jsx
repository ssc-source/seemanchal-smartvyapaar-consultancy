"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Search, Loader2, Users } from "lucide-react";

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchLeads = async () => {
    try {
      const res = await adminApi.getLeads();
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminApi.updateLead(id, { status });
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (err) {
      alert("Failed to update status: " + (err.message || "Unknown error"));
    }
  };

  const filteredLeads = leads.filter(l => 
    l.ContactSubmission?.name.toLowerCase().includes(search.toLowerCase()) ||
    l.ContactSubmission?.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* List View */}
      <div className="w-1/2 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No leads found</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredLeads.map(lead => (
                <div 
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedLead?.id === lead.id ? 'bg-slate-50 border-l-4 border-brand-accent' : 'border-l-4 border-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-slate-900">{lead.ContactSubmission?.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'contacted' ? 'bg-amber-100 text-amber-700' :
                      lead.status === 'qualified' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{lead.ContactSubmission?.serviceOfInterest}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto">
        {selectedLead ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedLead.ContactSubmission?.name}</h2>
                <a href={`mailto:${selectedLead.ContactSubmission?.email}`} className="text-brand-accent text-sm hover:underline">
                  {selectedLead.ContactSubmission?.email}
                </a>
                <p className="text-slate-500 text-sm mt-1">{selectedLead.ContactSubmission?.phone}</p>
              </div>
              <select 
                value={selectedLead.status}
                onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Service of Interest</h4>
                <div className="bg-slate-50 p-3 rounded-lg text-slate-700">
                  {selectedLead.ContactSubmission?.serviceOfInterest}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Message</h4>
                <div className="bg-slate-50 p-4 rounded-lg text-slate-700 whitespace-pre-wrap">
                  {selectedLead.ContactSubmission?.message || "No message provided."}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Admin Notes</h4>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  rows={4}
                  placeholder="Add private notes here..."
                  defaultValue={selectedLead.notes}
                  onBlur={(e) => {
                    if (e.target.value !== selectedLead.notes) {
                      adminApi.updateLead(selectedLead.id, { notes: e.target.value });
                      setSelectedLead({...selectedLead, notes: e.target.value});
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <Users className="h-12 w-12 mb-4 text-slate-200" />
            <p>Select a lead from the list to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
