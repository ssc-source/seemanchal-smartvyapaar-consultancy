"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Loader2, Download, FileText } from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { API_BASE_URL } from "@/lib/api";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      // Fetch only paid registrations (which represent invoices)
      const res = await adminApi.getPayments({ paymentStatus: "paid", limit: 100 });
      const data = Array.isArray(res) ? res : res.data || [];
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!active) return;
      fetchInvoices();
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) {
      return invoices;
    }

    const q = searchTerm.toLowerCase();
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber?.toLowerCase().includes(q) ||
        inv.StudentProfile?.name?.toLowerCase().includes(q) ||
        inv.StudentProfile?.email?.toLowerCase().includes(q) ||
        inv.QuizExam?.title?.toLowerCase().includes(q)
    );
  }, [searchTerm, invoices]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Invoice Management</h1>
        <p className="text-slate-600 mt-2">View and download invoices for paid quiz assessments</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by invoice number, student name, email, or quiz..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Quiz Assessment</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date Paid</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  No invoices found
                </td>
              </tr>
            ) : (
              filtered.map((inv) => {
                const invoiceUrl = `${API_BASE_URL}/api/payments/${inv.id}/invoice`;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {inv.invoiceNumber || `INV-${inv.id.slice(0, 6).toUpperCase()}`}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{inv.StudentProfile?.name || '—'}</p>
                      <p className="text-xs text-slate-500">{inv.StudentProfile?.email || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {inv.QuizExam?.title || 'Quiz Assessment'}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">
                      ₹{Number(inv.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {inv.paymentCompletedAt ? new Date(inv.paymentCompletedAt).toLocaleDateString("en-IN") : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={invoiceUrl}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-lg text-slate-700 transition-colors text-xs font-semibold"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download HTML
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
