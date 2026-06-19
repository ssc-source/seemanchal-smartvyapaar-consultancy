"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function VerifyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    // Verification logic would go here
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Certificate Verification</h1>
        <p className="text-slate-600 mt-2">Verify student certificates and check authenticity</p>
      </div>

      <form onSubmit={handleVerify} className="bg-white p-8 rounded-lg border border-slate-200 max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Certificate ID or Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter certificate ID..."
              className="mt-2 w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Verify Certificate
          </button>
        </div>
      </form>
    </div>
  );
}
