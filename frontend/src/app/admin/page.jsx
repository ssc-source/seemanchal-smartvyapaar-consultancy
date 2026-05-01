"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, Layers } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leads: 0,
    services: 0,
    projects: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We will fetch real stats here once the endpoints are built.
    // For now, we simulate a loading state.
    const fetchStats = async () => {
      try {
        // Mock data fetch wait
        await new Promise(resolve => setTimeout(resolve, 500));
        setStats({ leads: 12, services: 8, projects: 15 });
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Leads", value: stats.leads, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Active Services", value: stats.services, icon: Layers, color: "bg-emerald-50 text-emerald-600" },
    { label: "Published Projects", value: stats.projects, icon: Briefcase, color: "bg-purple-50 text-purple-600" },
  ];

  if (isLoading) {
    return <div className="text-slate-500">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Welcome to the Admin Dashboard</h3>
        <p className="text-slate-600">
          From here you can manage all aspects of the SSC platform. Use the sidebar to navigate to specific sections.
          As we build out the CMS, you will be able to control leads, services, projects, and global site settings directly from this interface.
        </p>
      </div>
    </div>
  );
}
