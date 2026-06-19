"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Plus, Edit2, Trash2, UserPlus, XCircle, CheckCircle } from "lucide-react";

const statusOptions = ["UPCOMING", "ACTIVE", "COMPLETED"];
const programOptions = ["Frontend", "Backend", "Full Stack"];

export default function AdminBatches() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [assignBatch, setAssignBatch] = useState(null);
  const [assignStudentId, setAssignStudentId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    program: "Frontend",
    mentorName: "",
    startDate: "",
    endDate: "",
    maxStudents: 10,
    status: "UPCOMING",
  });

  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getBatches();
      setBatches(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await adminApi.getStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchStudents();
  }, []);

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      name: "",
      program: "Frontend",
      mentorName: "",
      startDate: "",
      endDate: "",
      maxStudents: 10,
      status: "UPCOMING",
    });
  };

  const handleEdit = (batch) => {
    setIsEditing(batch.id);
    setFormData({
      name: batch.name || "",
      program: batch.program || "Frontend",
      mentorName: batch.mentorName || "",
      startDate: batch.startDate || "",
      endDate: batch.endDate || "",
      maxStudents: batch.maxStudents || 10,
      status: batch.status || "UPCOMING",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Batch name is required.");
      return;
    }
    if (!programOptions.includes(formData.program)) {
      alert("Invalid program.");
      return;
    }
    if (!statusOptions.includes(formData.status)) {
      alert("Invalid status.");
      return;
    }

    try {
      if (isEditing) {
        await adminApi.updateBatch(isEditing, formData);
      } else {
        await adminApi.createBatch(formData);
      }
      resetForm();
      fetchBatches();
    } catch (err) {
      alert(err.message || "Failed to save batch.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this batch?")) return;
    try {
      await adminApi.deleteBatch(id);
      if (assignBatch?.id === id) {
        setAssignBatch(null);
        setAssignStudentId("");
      }
      fetchBatches();
    } catch (err) {
      alert(err.message || "Failed to delete batch.");
    }
  };

  const openAssignModal = (batch) => {
    setAssignBatch(batch);
    setAssignStudentId("");
  };

  const closeAssignModal = () => {
    setAssignBatch(null);
    setAssignStudentId("");
  };

  const handleAssignStudent = async () => {
    if (!assignStudentId) {
      alert("Please select a student to assign.");
      return;
    }

    try {
      await adminApi.updateStudent(assignStudentId, { batchId: assignBatch.id });
      closeAssignModal();
      fetchStudents();
      fetchBatches();
    } catch (err) {
      alert(err.message || "Failed to assign student.");
    }
  };

  const availableStudents = useMemo(() => {
    if (!assignBatch) return [];
    return students.filter((student) => student.batchId !== assignBatch.id);
  }, [assignBatch, students]);

  return (
    <div className="flex gap-6">
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-800">Batch Management</h3>
            <p className="text-sm text-slate-500">View, edit, and assign students to batches.</p>
          </div>
          <button onClick={resetForm} className="flex items-center gap-2 bg-brand-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800 transition-colors">
            <Plus className="h-4 w-4" /> Add Batch
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center text-slate-400">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-brand-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Program</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Mentor</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Start</th>
                  <th className="px-4 py-3 font-medium text-slate-600">End</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Students</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{batch.name}</td>
                    <td className="px-4 py-3">{batch.program}</td>
                    <td className="px-4 py-3">{batch.mentorName || '—'}</td>
                    <td className="px-4 py-3">{batch.startDate || '—'}</td>
                    <td className="px-4 py-3">{batch.endDate || '—'}</td>
                    <td className="px-4 py-3">{batch.currentStudents || 0}/{batch.maxStudents || 0}</td>
                    <td className="px-4 py-3 uppercase text-sm font-medium text-slate-700">{batch.status}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <button onClick={() => handleEdit(batch)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => openAssignModal(batch)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(batch.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {batches.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">No batches available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <h3 className="font-semibold text-slate-800 mb-4">{isEditing ? 'Edit Batch' : 'Create Batch'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
            <select value={formData.program} onChange={(e) => setFormData({ ...formData, program: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {programOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mentor Name</label>
            <input value={formData.mentorName} onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Max Students</label>
            <input type="number" min={1} value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) || 1 })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-brand-primary text-white rounded-lg py-2 hover:bg-slate-800 transition-colors">{isEditing ? 'Update Batch' : 'Create Batch'}</button>
            {isEditing && <button type="button" onClick={resetForm} className="px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Cancel</button>}
          </div>
        </form>
      </div>

      {assignBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h3 className="font-semibold text-slate-900">Assign Student to {assignBatch.name}</h3>
                <p className="text-sm text-slate-500">Choose a student to assign to this batch.</p>
              </div>
              <button onClick={closeAssignModal} className="text-slate-500 hover:text-slate-900"><XCircle className="h-6 w-6" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                <select value={assignStudentId} onChange={(e) => setAssignStudentId(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select a student</option>
                  {availableStudents.map((student) => (
                    <option key={student.id} value={student.id}>{student.name} — {student.email}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={closeAssignModal} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200">Close</button>
                <button onClick={handleAssignStudent} className="px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-slate-800">Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
