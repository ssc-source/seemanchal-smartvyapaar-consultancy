"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Calendar, BookOpen, TrendingUp } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function InternshipProgressPage() {
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getBatches();
      const data = Array.isArray(res) ? res : res.data || [];
      setBatches(data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-slate-600">Loading progress...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Internship Progress Tracking</h1>
        <p className="text-slate-600 mt-2">Monitor internship batch progress and student performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {batches.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-600">
            <p>No batches found</p>
          </div>
        ) : (
          batches.map((batch) => (
            <Link key={batch.id} href={`/admin/batches/${batch.id}`}>
              <div className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {batch.batchName}
                </h3>
                <p className="text-sm text-slate-600 mt-2">Status: {batch.status}</p>
                <p className="text-sm text-slate-600">Start Date: {new Date(batch.startDate).toLocaleDateString("en-IN")}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
