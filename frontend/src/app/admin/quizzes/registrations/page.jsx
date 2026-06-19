"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Loader2, BookOpen } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getPayments({ limit: 100 });
      const data = Array.isArray(res) ? res : res.data || [];
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!active) return;
      fetchRegistrations();
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = registrations;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (reg) =>
          reg.StudentProfile?.name?.toLowerCase().includes(q) ||
          reg.StudentProfile?.email?.toLowerCase().includes(q) ||
          reg.QuizExam?.title?.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "ALL") {
      result = result.filter((reg) => reg.status === filterStatus);
    }

    return result;
  }, [searchTerm, filterStatus, registrations]);

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
        <h1 className="text-3xl font-bold text-slate-900 font-sans tracking-tight">Assessment Registrations</h1>
        <p className="text-slate-600 mt-2">Track student quiz registrations, payments, and attempt history</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email or quiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="ALL">All Status</option>
          <option value="pending">Pending</option>
          <option value="activated">Activated</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Quiz</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Eligibility</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Attempts</th>
              <th className="px-6 py-4">Registered Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  No registrations found
                </td>
              </tr>
            ) : (
              filtered.map((reg) => {
                const attemptsCount = reg.attempts?.length || 0;
                const isEligible = reg.paymentStatus === 'paid' && reg.status === 'activated';
                return (
                  <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{reg.StudentProfile?.name || '—'}</p>
                      <p className="text-xs text-slate-500">{reg.StudentProfile?.email || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {reg.QuizExam?.title || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        reg.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        reg.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {reg.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        isEligible ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isEligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                        reg.status === 'activated' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        reg.status === 'completed' ? 'bg-slate-50 text-slate-700 border border-slate-200' :
                        reg.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                        {attemptsCount} attempts
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(reg.createdAt).toLocaleDateString("en-IN")}
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
