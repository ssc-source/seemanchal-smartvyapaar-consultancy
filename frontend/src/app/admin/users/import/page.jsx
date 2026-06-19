"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import { API_BASE_URL } from "@/lib/api";
import { ChevronLeft, Loader2, CheckCircle, AlertCircle, Download } from "lucide-react";

const SAMPLE_CSV = `name,email,phone,dob,college,course
Jane Doe,jane@example.com,+91 9876543210,1999-05-15,IIT Delhi,B.Tech
John Smith,john@example.com,+91 9876543211,2000-03-20,Delhi University,B.Sc
Sarah Khan,sarah@example.com,+91 9876543212,1999-08-10,NSIT Delhi,B.Tech`;

export default function ImportUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setError(null);
    } else {
      setError("Please select a valid CSV file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
      setError(null);
    } else {
      setError("Please drop a valid CSV file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setError("Please select a CSV file");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("csv", csvFile);

      const response = await fetch(`${API_BASE_URL}/admin/users/import-csv`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${adminApi.token || ""}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Import failed");
      }

      setSuccess(true);
      setImportResult(result);
      setCsvFile(null);
    } catch (err) {
      setError(err.message || "Failed to import users");
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([SAMPLE_CSV], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "sample_users.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (success && importResult) {
    return (
      <div className="space-y-6">
        <Link href="/admin/users" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ChevronLeft size={20} />
          Back to User Management
        </Link>

        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-900 mb-2">Users Imported Successfully</h1>
          <p className="text-green-800 mb-6">
            {importResult.successCount || 0} user(s) were successfully imported.
          </p>

          {(importResult.successCount || importResult.errors?.length > 0) && (
            <div className="bg-white rounded-lg p-4 text-left max-w-2xl mx-auto mb-6 border border-green-200">
              <div className="space-y-3">
                {importResult.successCount && (
                  <div>
                    <p className="text-sm text-green-600 font-medium">✓ Successfully Created</p>
                    <p className="font-bold text-green-700">{importResult.successCount} user(s)</p>
                  </div>
                )}
                {importResult.errors?.length > 0 && (
                  <div>
                    <p className="text-sm text-amber-600 font-medium">⚠ Errors</p>
                    <ul className="text-amber-700 text-sm space-y-1">
                      {importResult.errors.slice(0, 5).map((error, idx) => (
                        <li key={idx}>• {error}</li>
                      ))}
                      {importResult.errors.length > 5 && (
                        <li>... and {importResult.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setSuccess(false);
                setImportResult(null);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Import Another File
            </button>
            <Link href="/admin/users" className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors inline-block">
              Back to User Management
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
        <ChevronLeft size={20} />
        Back to User Management
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Import Users from CSV</h1>
        <p className="text-slate-600 mt-1">Bulk create student user accounts from a CSV file</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error</p>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-slate-50"
              }`}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-input"
              />
              <label htmlFor="csv-input" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="text-4xl">📄</div>
                  <p className="font-medium text-slate-900">
                    {csvFile ? `Selected: ${csvFile.name}` : "Drag and drop CSV file or click to select"}
                  </p>
                  <p className="text-sm text-slate-600">CSV format required</p>
                </div>
              </label>
            </div>

            {/* CSV Format Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-900 mb-2">Required CSV Format:</p>
              <div className="bg-white p-2 rounded border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto">
                <div>name,email,phone,dob,college,course</div>
                <div className="text-slate-500 mt-1">Jane Doe,jane@example.com,+91 9876543210,1999-05-15,IIT Delhi,B.Tech</div>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                • name (required) • email (required) • phone, dob, college, course (optional)
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !csvFile}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Importing..." : "Import Users"}
              </button>
              <Link href="/admin/users" className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center">
                Cancel
              </Link>
            </div>
          </div>
        </form>

        {/* Sidebar: Help & Sample */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">How to Import</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li>1. Prepare a CSV file with user data</li>
              <li>2. Include required columns: name, email</li>
              <li>3. Add optional columns: phone, dob, college, course</li>
              <li>4. Upload the file using the form</li>
              <li>5. Registration IDs will be auto-generated</li>
            </ol>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 mb-3">Sample CSV</h3>
            <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-700 mb-3 max-h-32 overflow-y-auto">
              {SAMPLE_CSV.split("\n").map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
            <button
              type="button"
              onClick={downloadSampleCSV}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
            >
              <Download size={16} />
              Download Sample
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium text-amber-900 mb-2">Important Notes</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Duplicate emails will be skipped</li>
              <li>• Registration IDs are auto-generated</li>
              <li>• Emails sent with login credentials</li>
              <li>• Users must change password on login</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
