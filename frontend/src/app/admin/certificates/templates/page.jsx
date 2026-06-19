"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Certificate Templates</h1>
          <p className="text-slate-600 mt-2">Manage certificate templates and designs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={18} />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="font-bold text-slate-900">Default Template</h3>
          <p className="text-sm text-slate-600 mt-2">Standard certificate template for internship completion</p>
          <div className="mt-4 flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded">
              <Edit size={18} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-red-100 rounded">
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
