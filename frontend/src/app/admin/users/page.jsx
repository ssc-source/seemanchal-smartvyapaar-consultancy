"use client";

import Link from "next/link";
import { Plus, Upload, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Create and manage student users and their registration IDs</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/users/add-manual">
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
              <Plus size={18} />
              Add User Manually
            </button>
          </Link>
          <Link href="/admin/users/import">
            <button className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors">
              <Upload size={18} />
              Import Users
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-900 font-medium">User Creation Features</p>
          <p className="text-blue-800 text-sm mt-1">
            When you create a user, a unique registration ID (e.g., SSC/2026/I-361) is automatically generated and sent to their email. The registration ID serves as their temporary password for first login. Users must change their password on first login.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add User Manually Card */}
        <Link href="/admin/users/add-manual">
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Add User Manually</h2>
                <p className="text-slate-600 text-sm mt-1">Create a single student user account</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Import Users Card */}
        <Link href="/admin/users/import">
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Import Users from CSV</h2>
                <p className="text-slate-600 text-sm mt-1">Bulk create users from a CSV file</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
