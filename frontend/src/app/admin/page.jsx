"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Layers,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { adminApi } from "@/lib/adminApi";

const StatCard = ({ label, value, icon: Icon, color, trend, link }) => (
  <Link href={link || "#"}>
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
          {trend !== undefined && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        <div className={`p-4 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  </Link>
);

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchDashboardData = async () => {
      try {
        // Use Promise.allSettled() instead of Promise.all()
        // This way, if one endpoint fails, the others still load
        const results = await Promise.allSettled([
          adminApi.getDashboardMetrics(),
          adminApi.getDashboardRecentActivity(),
        ]);

        if (!active) return;

        // Process results safely
        const metricsResult = results[0];
        const activityResult = results[1];

        if (metricsResult.status === 'fulfilled') {
          setMetrics(metricsResult.value?.data || null);
        } else {
          console.error("Metrics load failed:", metricsResult.reason?.message || metricsResult.reason);
        }

        if (activityResult.status === 'fulfilled') {
          setActivity(activityResult.value?.data || []);
        } else {
          console.error("Activity load failed:", activityResult.reason?.message || activityResult.reason);
        }

        // Check if at least one succeeded
        const hasAnyData = 
          metricsResult.status === 'fulfilled' ||
          activityResult.status === 'fulfilled';

        // Only set error if ALL failed
        if (!hasAnyData) {
          setError("Unable to load dashboard data. Please try again.");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load dashboard");
        }
        console.error("Dashboard error:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchDashboardData();
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-slate-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div className="text-slate-600">No data available</div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {/* Primary KPIs - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Internship Applications"
          value={metrics.totalApplications}
          icon={Briefcase}
          color="bg-blue-50 text-blue-600"
          link="/admin/careers"
        />
        <StatCard
          label="Active Interns"
          value={metrics.activeInterns}
          icon={Users}
          color="bg-emerald-50 text-emerald-600"
          link="/admin/students"
        />
        <StatCard
          label="Active Batches"
          value={metrics.activeBatches}
          icon={Layers}
          color="bg-purple-50 text-purple-600"
          link="/admin/batches"
        />
        <StatCard
          label="Assessment Registrations"
          value={metrics.assessmentRegistrations}
          icon={BookOpen}
          color="bg-orange-50 text-orange-600"
          link="/admin/quizzes"
        />
      </div>

      {/* Secondary KPIs - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Certificates Issued"
          value={metrics.certificatesIssued}
          icon={Award}
          color="bg-pink-50 text-pink-600"
          link="/admin/certificates"
        />
        <StatCard
          label="Assessment Pass Rate"
          value={`${metrics.passPercentage}%`}
          icon={TrendingUp}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          label="Pending Reviews"
          value={metrics.pendingReviews}
          icon={Clock}
          color="bg-yellow-50 text-yellow-600"
          link="/admin/careers"
        />
        <StatCard
          label="Failed Students"
          value={metrics.failedStudents}
          icon={AlertCircle}
          color="bg-red-50 text-red-600"
        />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Today&apos;s Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {formatCurrency(metrics.todayRevenue)}
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {formatCurrency(metrics.monthRevenue)}
              </h3>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
        <Link href="/admin/revenue">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {formatCurrency(metrics.totalRevenue)}
                </h3>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 text-purple-600">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Future Skills Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/future-skills">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Future Skills Inquiries</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {metrics.futureSkillsInquiries ?? 'View'}
                </h3>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 text-slate-700">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-3">Click to review submitted Future Skills Lab inquiries.</p>
          </div>
        </Link>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Future Skills Dashboard</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">Quick Access</h3>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3">Manage school inquiries, update status, and track engagement from one place.</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-slate-200">
          {activity.length === 0 ? (
            <div className="p-6 text-center text-slate-500">No recent activity</div>
          ) : (
            activity.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    {item.type === "application" && <Briefcase className="h-5 w-5 text-blue-600" />}
                    {item.type === "status_change" && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                    {item.type === "assessment" && <BookOpen className="h-5 w-5 text-orange-600" />}
                    {item.type === "certificate" && <Award className="h-5 w-5 text-pink-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.studentName}</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(item.timestamp).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link href="/admin/batches/new">
            <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm">
              Create Batch
            </button>
          </Link>
          <Link href="/admin/quizzes/new">
            <button className="w-full px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm">
              Create Assessment
            </button>
          </Link>
          <Link href="/admin/certificates">
            <button className="w-full px-4 py-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors font-medium text-sm">
              Issue Certificate
            </button>
          </Link>
          <Link href="/admin/students/new">
            <button className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-sm">
              Add Student
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
