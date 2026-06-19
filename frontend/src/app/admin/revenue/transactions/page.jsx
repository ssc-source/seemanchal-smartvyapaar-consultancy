"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Download, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getPayments({ limit: 100 });
      const data = Array.isArray(res) ? res : res.data || [];
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!active) return;
      fetchTransactions();
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let result = transactions;

    if (filterStatus !== "ALL") {
      result = result.filter((tx) => {
        if (filterStatus === "COMPLETED") return tx.paymentStatus === "paid";
        if (filterStatus === "PENDING") return tx.paymentStatus === "pending";
        if (filterStatus === "FAILED") return tx.paymentStatus === "failed";
        return true;
      });
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.StudentProfile?.email?.toLowerCase().includes(q) ||
          tx.gatewayOrderId?.toLowerCase().includes(q) ||
          tx.gatewayPaymentId?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchTerm, filterStatus, transactions]);

  const total = filtered.reduce((sum, tx) => (tx.paymentStatus === "paid" ? sum + Number(tx.amount || 0) : sum), 0);

  const handleExport = async () => {
    try {
      const res = await adminApi.exportPayments();
      if (res.data) {
        const blob = new Blob([res.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions-${Date.now()}.csv`;
        a.click();
      }
    } catch (err) {
      alert(err.message || "Failed to export");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Transactions</h1>
          <p className="text-slate-600 mt-2">All student payment transactions and reference history</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer text-sm font-semibold"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by student email, order ID, or payment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
        >
          <option value="ALL">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {filtered.length > 0 && (
        <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-800">
            Total Revenue: ₹{Math.round(total).toLocaleString("en-IN")} ({filtered.length} transactions)
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                  No transactions found
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-slate-900 break-all">{tx.gatewayOrderId || tx.id}</td>
                  <td className="px-6 py-4 text-slate-600">{tx.StudentProfile?.email || '—'}</td>
                  <td className="px-6 py-4 text-slate-900 font-semibold">₹{Number(tx.amount || 0).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                      tx.paymentStatus === "paid" ? "bg-green-50 text-green-700 border border-green-200" :
                      tx.paymentStatus === "pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                      "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {tx.paymentStatus === "paid" ? "COMPLETED" : tx.paymentStatus?.toUpperCase() || "PENDING"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
