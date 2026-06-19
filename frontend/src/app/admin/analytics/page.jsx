"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Briefcase, BookOpen } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-2">Comprehensive platform analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Applications</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Students</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
            </div>
            <Users className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed Assessments</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0</p>
            </div>
            <BookOpen className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pass Rate</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">0%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Applications Trend</h3>
          <div className="h-64 bg-slate-50 rounded flex items-center justify-center text-slate-500">
            Chart data will display here
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Revenue Trend</h3>
          <div className="h-64 bg-slate-50 rounded flex items-center justify-center text-slate-500">
            Chart data will display here
          </div>
        </div>
      </div>
    </div>
  );
}
