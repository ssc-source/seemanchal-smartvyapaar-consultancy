// src/app/not-found.js

import Link from "next/link";
import { ArrowRight, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white flex items-center justify-center px-6 py-20">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Grid Background */}
      <div
        className="
          absolute inset-0 opacity-40
          bg-[linear-gradient(to_right,#e2e8f020_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f020_1px,transparent_1px)]
          bg-[size:50px_50px]
        "
      />

      {/* Main Card */}
      <div
        className="
          relative z-10
          w-full max-w-3xl
          rounded-[36px]
          border border-slate-200/80
          bg-white/90
          backdrop-blur-2xl
          shadow-[0_20px_80px_rgba(15,23,42,0.08)]
          p-8 sm:p-12 md:p-16
          text-center
        "
      >
        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 border border-blue-100 shadow-inner">
          <SearchX className="h-12 w-12 text-blue-600" />
        </div>

        {/* 404 */}
        <div className="mt-8">
          <span className="text-[90px] sm:text-[120px] font-black tracking-tight leading-none bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            404
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl mx-auto text-slate-500 text-sm sm:text-base md:text-lg leading-relaxed">
          The page you’re looking for doesn’t exist, may have been moved,
          or is temporarily unavailable. Let’s get you back to exploring
          SSC’s modern digital ecosystem.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          <Link
            href="/"
            className="
              inline-flex items-center justify-center gap-2
              rounded-2xl
              bg-blue-600
              px-6 py-3
              text-white font-semibold
              shadow-lg shadow-blue-500/20
              transition-all duration-300
              hover:-translate-y-1 hover:bg-blue-700
            "
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="
              inline-flex items-center justify-center gap-2
              rounded-2xl
              border border-slate-200
              bg-white
              px-6 py-3
              text-slate-700 font-semibold
              transition-all duration-300
              hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50
            "
          >
            Explore Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Footer Text */}
        <div className="mt-12 border-t border-slate-200 pt-6">
          <p className="text-xs sm:text-sm text-slate-400">
            Seemanchal SmartVyapaar Consultancy • Scalable ERP • AI Systems • Cloud Platforms
          </p>
        </div>
      </div>
    </main>
  );
}