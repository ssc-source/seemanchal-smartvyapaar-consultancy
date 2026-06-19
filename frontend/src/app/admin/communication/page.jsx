"use client";

import { useEffect, useState } from "react";
import { Search, Send } from "lucide-react";

export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Communication Center</h1>
        <p className="text-slate-600 mt-2">Track and manage student communications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Total Sent</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Today</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Templates</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">7</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600">Failed</p>
          <p className="text-3xl font-bold text-red-600 mt-2">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
        <p>Communication history will appear here</p>
      </div>
    </div>
  );
}
