"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Plus, Edit2, Trash2, FileText, Search } from "lucide-react";

const certificateTypes = ["Internship", "Quiz Participation", "Quiz Merit"];

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    studentId: "",
    certificateType: "Internship",
    pdfUrl: "",
    certificateId: "",
    verificationCode: "",
  });

  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getCertificates();
      setCertificates(res.data || []);
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
    fetchCertificates();
    fetchStudents();
  }, []);

  const resetForm = () => {
    setSelectedId(null);
    setFormData({ studentId: "", certificateType: "Internship", pdfUrl: "", certificateId: "", verificationCode: "" });
  };

  const handleEdit = (certificate) => {
    setSelectedId(certificate.id);
    setFormData({
      studentId: certificate.studentId || "",
      certificateType: certificate.certificateType || "Internship",
      pdfUrl: certificate.pdfUrl || "",
      certificateId: certificate.certificateId || "",
      verificationCode: certificate.verificationCode || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId) {
      alert("Student selection is required.");
      return;
    }

    try {
      if (selectedId) {
        await adminApi.updateCertificate(selectedId, formData);
      } else {
        await adminApi.createCertificate(formData);
      }
      resetForm();
      fetchCertificates();
    } catch (err) {
      alert(err.message || "Failed to save certificate.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await adminApi.deleteCertificate(id);
      fetchCertificates();
      if (selectedId === id) resetForm();
    } catch (err) {
      alert(err.message || "Failed to delete certificate.");
    }
  };

  const filteredCertificates = certificates.filter((certificate) => {
    const student = students.find((s) => s.id === certificate.studentId);
    const studentName = student?.name || "";
    return (
      certificate.certificateId.toLowerCase().includes(search.toLowerCase()) ||
      certificate.verificationCode.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-800">Certificates</h3>
            <p className="text-sm text-slate-500">Manage generated certificates and verification codes.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search certificates..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600">Certificate ID</th>
                <th className="px-4 py-3 font-medium text-slate-600">Student</th>
                <th className="px-4 py-3 font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 font-medium text-slate-600">Issued</th>
                <th className="px-4 py-3 font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCertificates.map((certificate) => {
                const student = students.find((s) => s.id === certificate.studentId);
                return (
                  <tr key={certificate.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{certificate.certificateId}</td>
                    <td className="px-4 py-3">{student?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{certificate.certificateType}</td>
                    <td className="px-4 py-3">{new Date(certificate.issuedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <button onClick={() => handleEdit(certificate)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(certificate.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
              {filteredCertificates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No certificates found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit sticky top-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">{selectedId ? 'Edit Certificate' : 'Issue Certificate'}</h3>
            <p className="text-sm text-slate-500">Generate a new certificate with a unique verification code.</p>
          </div>
          <Plus className="h-5 w-5 text-brand-primary" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
            <select value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required>
              <option value="">Choose a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Certificate Type</label>
            <select value={formData.certificateType} onChange={(e) => setFormData({ ...formData, certificateType: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {certificateTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PDF URL</label>
            <input type="url" value={formData.pdfUrl} onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Certificate ID</label>
            <input value={formData.certificateId} onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Optional; generated automatically" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Verification Code</label>
            <input value={formData.verificationCode} onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Optional; generated automatically" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-brand-primary text-white py-2 rounded-lg hover:bg-slate-800 transition-colors">{selectedId ? 'Update' : 'Create'}</button>
            {selectedId && <button type="button" onClick={resetForm} className="px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Reset</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
