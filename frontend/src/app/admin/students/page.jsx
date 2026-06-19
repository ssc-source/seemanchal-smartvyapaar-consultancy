"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Plus, Edit2, Trash2 } from "lucide-react";

const trackOptions = ["Frontend", "Backend", "Full Stack"];
const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED"];
const internshipStatusOptions = ["APPLIED", "IN_PROGRESS", "COMPLETED"];

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    track: "Frontend",
    batchId: "",
    internshipStatus: "APPLIED",
    week1Status: "PENDING",
    week2Status: "PENDING",
    week3Status: "PENDING",
    week4Status: "PENDING",
    week5Status: "PENDING",
    week6Status: "PENDING",
    mentorRemarks: "",
    certificateIssued: false,
  });

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await adminApi.getBatches();
      setBatches(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchStudents(), fetchBatches()]);
    };
    load();
  }, []);

  const resetForm = () => {
    setIsEditing(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      college: "",
      track: "Frontend",
      batchId: "",
      internshipStatus: "APPLIED",
      week1Status: "PENDING",
      week2Status: "PENDING",
      week3Status: "PENDING",
      week4Status: "PENDING",
      week5Status: "PENDING",
      week6Status: "PENDING",
      mentorRemarks: "",
      certificateIssued: false,
    });
  };

  const handleEdit = (student) => {
    setIsEditing(student.id);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      college: student.college || "",
      track: student.track || "Frontend",
      batchId: student.batchId || "",
      internshipStatus: student.internshipStatus || "APPLIED",
      week1Status: student.week1Status || "PENDING",
      week2Status: student.week2Status || "PENDING",
      week3Status: student.week3Status || "PENDING",
      week4Status: student.week4Status || "PENDING",
      week5Status: student.week5Status || "PENDING",
      week6Status: student.week6Status || "PENDING",
      mentorRemarks: student.mentorRemarks || "",
      certificateIssued: student.certificateIssued || false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required.");
      return;
    }

    try {
      if (isEditing) {
        await adminApi.updateStudent(isEditing, formData);
      } else {
        await adminApi.createStudent(formData);
      }
      resetForm();
      fetchStudents();
    } catch (err) {
      alert(err.message || "Failed to save student.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    try {
      await adminApi.deleteStudent(id);
      fetchStudents();
      if (isEditing === id) resetForm();
    } catch (err) {
      alert(err.message || "Failed to delete student.");
    }
  };

  const getBatchName = (id) => {
    const batch = batches.find((item) => item.id === id);
    return batch ? batch.name : "Unassigned";
  };

  const getBatchDateRange = (id) => {
    const batch = batches.find((item) => item.id === id);
    if (!batch) return '–';
    return `${batch.startDate || '–'} to ${batch.endDate || '–'}`;
  };

  return (
    <div className="flex gap-6">
      <div className="w-2/3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-800">Student Profiles</h3>
            <p className="text-sm text-slate-500">Track student progress, certificates, and batch assignments.</p>
          </div>
          <button onClick={resetForm} className="flex items-center gap-2 bg-brand-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800 transition-colors">
            <Plus className="h-4 w-4" /> New Student
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="px-4 py-3 font-medium text-slate-600">Phone</th>
                <th className="px-4 py-3 font-medium text-slate-600">College</th>
                <th className="px-4 py-3 font-medium text-slate-600">Track</th>
                <th className="px-4 py-3 font-medium text-slate-600">Batch</th>
                <th className="px-4 py-3 font-medium text-slate-600">Batch Dates</th>
                <th className="px-4 py-3 font-medium text-slate-600">Internship Status</th>
                <th className="px-4 py-3 font-medium text-slate-600">Certificate</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3">{student.email}</td>
                  <td className="px-4 py-3">{student.phone || '–'}</td>
                  <td className="px-4 py-3">{student.college || '–'}</td>
                  <td className="px-4 py-3">{student.track}</td>
                  <td className="px-4 py-3">{getBatchName(student.batchId)}</td>
                  <td className="px-4 py-3">{getBatchDateRange(student.batchId)}</td>
                  <td className="px-4 py-3">{student.internshipStatus || 'APPLIED'}</td>
                  <td className="px-4 py-3">
                    {student.certificateIssued ? <span className="text-emerald-700">Issued</span> : <span className="text-slate-500">Pending</span>}
                  </td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(student.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">No student records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-1/3 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <h3 className="font-semibold text-slate-800 mb-4">{isEditing ? 'Edit Student' : 'Create Student'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">College</label>
            <input value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Track</label>
            <select value={formData.track} onChange={(e) => setFormData({ ...formData, track: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {trackOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Batch</label>
            <select value={formData.batchId} onChange={(e) => setFormData({ ...formData, batchId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="">Unassigned</option>
              {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Internship Status</label>
            <select value={formData.internshipStatus} onChange={(e) => setFormData({ ...formData, internshipStatus: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {internshipStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week 1</label>
              <select value={formData.week1Status} onChange={(e) => setFormData({ ...formData, week1Status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week 2</label>
              <select value={formData.week2Status} onChange={(e) => setFormData({ ...formData, week2Status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week 3</label>
              <select value={formData.week3Status} onChange={(e) => setFormData({ ...formData, week3Status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week 4</label>
              <select value={formData.week4Status} onChange={(e) => setFormData({ ...formData, week4Status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week 5</label>
              <select value={formData.week5Status} onChange={(e) => setFormData({ ...formData, week5Status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Week 6</label>
              <select value={formData.week6Status} onChange={(e) => setFormData({ ...formData, week6Status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mentor Remarks</label>
            <textarea rows={3} value={formData.mentorRemarks} onChange={(e) => setFormData({ ...formData, mentorRemarks: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={formData.certificateIssued} onChange={(e) => setFormData({ ...formData, certificateIssued: e.target.checked })} className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
              Certificate issued
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-brand-primary text-white py-2 rounded-lg hover:bg-slate-800 transition-colors">{isEditing ? 'Update Student' : 'Create Student'}</button>
            {isEditing && <button type="button" onClick={resetForm} className="px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
