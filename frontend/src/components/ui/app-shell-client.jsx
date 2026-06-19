"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function AppShellClient({ children, header, footer, mobileNav }) {
  const pathname = usePathname();

  // Hide header/footer on quiz, assessment, certificate, and full-screen exam pages.
  // We use precise matching to avoid false positives (e.g., /certificate-guide).
  const shouldHide = pathname && (
    pathname === "/career/assessment" || pathname.startsWith("/career/assessment/") ||
    pathname === "/career/certificate" || pathname.startsWith("/career/certificate/") ||
    pathname === "/assessment" || pathname.startsWith("/assessment/") ||
    pathname === "/certificate" || pathname.startsWith("/certificate/")
  );

  if (shouldHide) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      {header}

      <div className="pt-16">
        {children}
      </div>

      {mobileNav}
      {footer}
    </div>
  );
}
