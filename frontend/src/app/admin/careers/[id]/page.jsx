"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Trash2, Plus } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

const statuses = [
  "APPLIED",
  "SCREENING",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "SELECTED",
  "ONBOARDED",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
];

export default function ApplicationDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [notes, setNotes] = useState([]);
  const [history, setHistory] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(id && id !== "new");
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchApplication = useCallback(async () => {
    if (!id || id === "new") {
      return;
    }
    try {
      const [appRes, notesRes, historyRes] = await Promise.all([
        adminApi.getInternshipApplication(id),
        adminApi.getInternshipNotes(id),
        adminApi.getInternshipHistory(id),
      ]);

      const appData = appRes.data || appRes;
      setApplication(appData);
      setEditData(appData);
      setNotes(Array.isArray(notesRes) ? notesRes : notesRes.data || []);
      setHistory(Array.isArray(historyRes) ? historyRes : historyRes.data || []);
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && id !== "new") {
      const timer = setTimeout(() => {
        fetchApplication();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [id, fetchApplication]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await adminApi.updateInternshipApplication(id, editData);
      setApplication(editData);
      alert("Application updated successfully");
    } catch (error) {
      console.error("Error saving application:", error);
      alert("Failed to save application");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await adminApi.addInternshipNote(id, { content: newNote });
      setNewNote("");
      fetchApplication();
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      await adminApi.deleteInternshipApplication(id);
      router.push("/admin/careers");
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  };

  if (isLoading) {
    return <div className="text-slate-600">Loading application...</div>;
  }

  if (!application) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Application not found</p>
        <Link href="/admin/careers" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/careers">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ChevronLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{application.studentName}</h1>
            <p className="text-slate-600 mt-1">{application.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Details */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Application Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Student Name</label>
                <input
                  type="text"
                  value={editData.studentName || ""}
                  onChange={(e) => setEditData({ ...editData, studentName: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={editData.email || ""}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Internship Track</label>
                <input
                  type="text"
                  value={editData.internshipTrack || ""}
                  onChange={(e) => setEditData({ ...editData, internshipTrack: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={editData.status || "APPLIED"}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Timeline/History */}
          {history.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Status History</h2>
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Changed to {item.newStatus}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Internal Notes</h2>
            <div className="space-y-4">
              {/* Add Note Form */}
              <div className="flex gap-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                />
              </div>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
              >
                <Plus size={18} />
                Add Note
              </button>

              {/* Notes List */}
              <div className="space-y-3 mt-6">
                {notes.map((note, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-900">{note.content}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {note.createdBy || 'System'} • {new Date(note.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Status</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{editData.status}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Applied On</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">
                {new Date(application.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Phone</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{application.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Notes Count</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{notes.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
