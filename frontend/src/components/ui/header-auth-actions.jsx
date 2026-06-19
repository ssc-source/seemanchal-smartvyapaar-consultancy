"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export function HeaderAuthActions() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsAuthenticated(sessionStorage.getItem("studentAuthenticated") === "true");
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      sessionStorage.removeItem("studentAuthenticated");
      window.location.href = "/auth/login";
    }
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth/login"
        className="text-slate-600 font-semibold hover:text-brand-accent transition-all duration-300 text-sm hover:-translate-y-0.5 active:translate-y-0"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard"
        className="text-slate-600 font-semibold hover:text-brand-accent transition-all duration-300 text-sm flex items-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
      >
        <LayoutDashboard className="h-4 w-4 text-slate-500" />
        Dashboard
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full text-slate-700 transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs hover:shadow-md"
      >
        <LogOut className="h-3.5 w-3.5" />
        Logout
      </button>
    </div>
  );
}
