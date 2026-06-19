"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { adminApi } from '@/lib/adminApi';
import { 
  RefreshCw, CheckCircle, Download, ShieldCheck, Sparkles, Wallet,
  TrendingUp, Users, Award, AlertCircle, Loader2
} from 'lucide-react';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-3">{value}</p>
          {subtitle && <p className="text-xs mt-2 opacity-60">{subtitle}</p>}
        </div>
        <Icon className="h-8 w-8 opacity-50 ml-4" />
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
  };
  const config = configs[status] || configs.pending;
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
};

const RefundStatusBadge = ({ status }) => {
  const configs = {
    none: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'No Refund' },
    processed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Refunded' },
    requested: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Requested' },
    failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
  };
  const config = configs[status] || configs.none;
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}>{config.label}</span>;
};

export default function RevenuePage() {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, paymentsRes] = await Promise.all([
        adminApi.getRevenueSummary(),
        adminApi.getPayments({ page, limit: 50 }),
      ]);

      setSummary(summaryRes.data || null);
      setPayments(paymentsRes.data || []);
      setMeta(paymentsRes.meta || {});
    } catch (err) {
      console.error('[Revenue Dashboard]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await adminApi.exportPayments();
      if (result && result.data && typeof result.data === 'string') {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `ssc-revenue-${new Date().toISOString().split('T')[0]}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('[Revenue Export]', err);
      alert('Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const refundCount = payments.filter(p => p.refundStatus === 'processed').length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Revenue Dashboard</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Live revenue insights for internship assessment purchases, registration payments, and certificate issuance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
            >
              <Download className="h-4 w-4" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Total Revenue"
            value={summary ? `₹${summary.totalRevenue || 0}` : '—'}
            subtitle="All-time earnings"
            icon={Wallet}
            color="blue"
          />
          <MetricCard
            title="Today's Revenue"
            value={summary ? `₹${summary.todaysRevenue || 0}` : '—'}
            subtitle="Last 24 hours"
            icon={TrendingUp}
            color="green"
          />
          <MetricCard
            title="This Month"
            value={summary ? `₹${summary.monthlyRevenue || 0}` : '—'}
            subtitle="Current month"
            icon={Sparkles}
            color="purple"
          />
          <MetricCard
            title="Total Registrations"
            value={summary ? summary.paidCount || 0 : '—'}
            subtitle="Paid assessments"
            icon={ShieldCheck}
            color="blue"
          />
          <MetricCard
            title="Certificates Issued"
            value={summary ? summary.certCount || 0 : '—'}
            subtitle="Completion certificates"
            icon={Award}
            color="green"
          />
          <MetricCard
            title="Refunds Processed"
            value={refundCount}
            subtitle="Total refunded transactions"
            icon={AlertCircle}
            color="orange"
          />
        </div>

        {/* Revenue Trend Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Revenue Trend</h2>
              <p className="text-sm text-slate-600 mt-1">Payment activity for the last 30 days</p>
            </div>
          </div>

          {summary?.timeseries && summary.timeseries.length > 0 ? (
            <div className="h-64 overflow-x-auto">
              <svg 
                viewBox={`0 0 ${summary.timeseries.length * 20} 200`} 
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[0, 50, 100, 150, 200].map((y) => (
                  <line key={`grid-${y}`} x1="0" y1={y} x2="100%" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                ))}

                {/* Chart area */}
                {summary.timeseries.length > 1 && (
                  <>
                    <polyline
                      points={summary.timeseries
                        .map((d, i) => {
                          const x = (i / (summary.timeseries.length - 1)) * 100;
                          const maxAmount = Math.max(...summary.timeseries.map(d => d.amount));
                          const y = 200 - ((d.amount / maxAmount) * 180 + 10);
                          return `${x}%,${y}`;
                        })
                        .join(' ')}
                      fill="url(#chartGradient)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    
                    {/* Data points */}
                    {summary.timeseries.map((d, i) => {
                      const x = (i / (summary.timeseries.length - 1)) * 100;
                      const maxAmount = Math.max(...summary.timeseries.map(d => d.amount));
                      const y = 200 - ((d.amount / maxAmount) * 180 + 10);
                      return (
                        <circle key={`point-${i}`} cx={`${x}%`} cy={y} r="3" fill="#3b82f6" />
                      );
                    })}
                  </>
                )}
              </svg>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-slate-500">
              <AlertCircle className="h-6 w-6 mr-2" />
              No revenue data available
            </div>
          )}
        </div>

        {/* Recent Payments Table */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Recent Payments</h2>
              <p className="text-sm text-slate-600 mt-1">Latest assessment registrations and transactions</p>
            </div>
            {meta.total && (
              <div className="inline-block rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Total: {meta.total} records
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : payments.length ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Payment ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Refund</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-700 font-mono text-xs">{payment.id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">₹{payment.amount || 0}</td>
                        <td className="px-4 py-3"><StatusBadge status={payment.paymentStatus} /></td>
                        <td className="px-4 py-3"><RefundStatusBadge status={payment.refundStatus} /></td>
                        <td className="px-4 py-3 text-slate-600">
                          {payment.paymentCompletedAt 
                            ? new Date(payment.paymentCompletedAt).toLocaleDateString()
                            : new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {payment.paymentStatus === 'paid' && payment.refundStatus === 'none' && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!confirm('Issue refund for this payment?')) return;
                                try {
                                  await adminApi.createRefund(payment.id, payment.amount, 'Admin refund requested');
                                  loadData();
                                  alert('Refund requested successfully.');
                                } catch (err) {
                                  console.error(err);
                                  alert('Refund failed.');
                                }
                              }}
                              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                            >
                              Issue Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="text-sm text-slate-600">
                    Page {page} of {meta.totalPages}
                  </div>
                  <button
                    onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-12 text-slate-500">
              No payments found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
