"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  LogOut,
  Layers
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Exclude login page from the admin shell layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoginPage && !adminApi.token) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, router]);

  if (!isMounted) return null; // Prevent hydration mismatch

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    adminApi.setToken(null);
    router.push("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Leads", href: "/admin/leads", icon: Users },
    { label: "Homepage", href: "/admin/homepage", icon: LayoutDashboard },
    { label: "Services", href: "/admin/services", icon: Layers },
    { label: "Projects", href: "/admin/projects", icon: Briefcase },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full">
        <div className="p-6">
          <h2 className="text-xl font-bold">SSC Admin</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-brand-accent text-white font-medium" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">
            {pathname.split("/").pop() === "admin" ? "Dashboard" : pathname.split("/").pop()}
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
