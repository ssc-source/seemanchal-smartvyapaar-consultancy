"use client";

import { Info } from "lucide-react";

export function EmptyState({
  title = "Nothing to show",
  description = "There is no content available for this section right now.",
  action,
  icon: Icon = Info,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
      {action && action.label && (
        <div className="mt-6">
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}
