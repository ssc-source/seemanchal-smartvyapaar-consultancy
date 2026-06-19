'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

export default function AdminCSVImportPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [imports, setImports] = useState([]);
  const toast = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn('Please select a CSV file');
      return;
    }
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('csv', file);
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/users/import-csv', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Import failed');
      setResult(data);
      // Refresh imports list
      fetchImports();
      toast.success(`Imported ${data.imported} users`);
    } catch (err) {
      toast.error('Import error: ' + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  const fetchImports = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/users/imports', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      if (res.ok && data.data) setImports(data.data);
    } catch (e) {
      console.warn('Failed to fetch imports', e.message || e);
    }
  };

  // load imports on mount
  if (typeof window !== 'undefined' && imports.length === 0) {
    fetchImports();
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Import Users from CSV</h1>
      <p className="mb-4">CSV columns: name,email,phone,dob,college,course</p>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <div className="mt-4">
        <button onClick={handleUpload} disabled={uploading} className="btn">
          {uploading ? 'Uploading...' : 'Upload & Import'}
        </button>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="font-semibold">Import Summary</h2>
          <p>Total: {result.total}</p>
          <p>Imported: {result.imported}</p>
          <p>Failed: {result.failed}</p>
        </div>
      )}

      {imports.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Recent Imports</h3>
          {imports.map((imp, idx) => (
            <div key={idx} className="mt-3 p-3 border rounded">
              <div className="text-sm text-slate-600">Imported at: {imp.timestamp}</div>
              <div className="text-sm">Total: {imp.total} — Imported: {imp.imported} — Failed: {imp.failed}</div>
              {imp.importedUsers && imp.importedUsers.length > 0 && (
                <div className="mt-2 text-sm">
                  <strong>Users:</strong>
                  <ul>
                    {imp.importedUsers.slice(0,10).map(u => (
                      <li key={u.row}>{u.row}: {u.name} — {u.email} — <code>{u.registrationId}</code></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
