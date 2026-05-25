// src/app/loading.js

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white via-slate-50 to-white flex items-center justify-center overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[400px] bg-blue-500/10 blur-3xl rounded-full" />

      {/* Grid Effect */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,#e2e8f020_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f020_1px,transparent_1px)]
          bg-[size:50px_50px]
          opacity-40
        "
      />

      {/* Loading Card */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Premium Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full border border-blue-100 animate-ping" />

          <div
            className="
              h-24 w-24 rounded-full
              bg-white/90 backdrop-blur-xl
              border border-slate-200
              shadow-[0_10px_40px_rgba(15,23,42,0.08)]
              flex items-center justify-center
            "
          >
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          </div>
        </div>

        {/* Branding */}
        <div className="mt-10 text-center px-6">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Seemanchal SmartVyapaar
          </h1>

          <p className="mt-3 text-slate-500 text-sm md:text-base max-w-md leading-relaxed">
            Building scalable digital infrastructure, ERP systems,
            AI-powered solutions, and modern business platforms.
          </p>
        </div>

        {/* Loading Dots */}
        <div className="mt-8 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-bounce" />
          <span
            className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </main>
  );
}