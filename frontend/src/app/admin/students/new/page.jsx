"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewStudentPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: wire to adminApi.createStudent when available
      console.log('Create student', { name, email });
      // optimistic navigation back to students list
      router.push('/admin/students');
    } catch (err) {
      console.error(err);
      alert('Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Add Student</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" placeholder="jane@example.com" />
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-900 text-white rounded">{loading? 'Creating...' : 'Create Student'}</button>
            <button type="button" onClick={()=>router.push('/admin/students')} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
