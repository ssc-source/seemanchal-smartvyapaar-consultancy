"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { Loader2 } from "lucide-react";

const trustPoints = [
  "Secure admin portal",
  "Fast access to operations",
  "Data and content management",
];

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await adminApi.login(email, password);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="relative overflow-hidden w-full max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.15),_transparent_18%),radial-gradient(circle_at_bottom_left,_rgba(148,163,184,0.10),_transparent_20%)]" />
        <div className="relative grid min-h-[560px] grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="hidden lg:flex flex-col justify-center gap-8 rounded-l-[2rem] border-r border-white/10 bg-slate-950/80 p-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
                  <Image src="/assets/Logo.png" alt="SSC logo" fill className="object-contain p-2" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-sky-400/80 font-semibold">
                    SSC Admin
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    Seemanchal Smartvyapaar Consultancy
                  </h2>
                </div>
              </div>

              <p className="max-w-sm text-slate-400 leading-7">
                A secure portal for managing operations, content, and workflows across SSC. Built for administrators who need a fast, dependable control experience.
              </p>
            </div>

            <div className="space-y-3">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/85 px-4 py-3 text-sm text-slate-300">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="flex items-center justify-center p-8 sm:p-10 lg:p-14">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800/80 bg-slate-900/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur-xl">
              <div className="space-y-3 text-center">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-400/90">
                  Secure access
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Admin sign in
                </h1>
                <p className="mx-auto max-w-xs text-sm text-slate-400 leading-6">
                  Enter your credentials to access the SSC administration dashboard.
                </p>
              </div>

              {error ? (
                <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleLogin} className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                    placeholder="admin@ssc-consultancy.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>&nbsp;</span>
                  <Link href="/admin/forgot-password" className="font-medium text-sky-400 transition hover:text-sky-300">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center rounded-2xl bg-sky-500 px-5 py-4 text-base font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Your SSC admin account secures access to internal tools and site management.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
