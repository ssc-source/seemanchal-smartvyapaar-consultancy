"use client";

import { Search } from "lucide-react";

export default function RefundsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Refunds</h1>
        <p className="text-slate-600 mt-2">Manage payment refunds</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search refunds..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
        <p>No refunds found</p>
      </div>
    </div>
  );
}
