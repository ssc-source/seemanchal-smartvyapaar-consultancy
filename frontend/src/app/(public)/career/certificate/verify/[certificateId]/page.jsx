"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import { FileSearch, CheckCircle, XCircle } from "lucide-react";

export default function CertificateVerificationPage({ params }) {
  const { certificateId } = use(params);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!certificateId) return;
    const fetchCertificate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(certificateId)}`);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'Verification failed');
        }
        setCertificate(result.data);
      } catch (err) {
        setError(err.message || 'Unable to verify certificate.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex flex-col gap-6 p-8 sm:p-12">
          <div className="flex items-center gap-3 text-slate-900">
            <FileSearch className="h-6 w-6 text-brand-primary" />
            <div>
              <h1 className="text-2xl font-semibold">Certificate Verification</h1>
              <p className="text-sm text-slate-500">Confirm authenticity using the certificate ID.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-3xl bg-slate-100 p-8 text-center text-slate-500">Verifying certificate…</div>
          ) : error ? (
            <div className="rounded-3xl bg-rose-50 p-8 text-center text-rose-700">
              <XCircle className="mx-auto h-10 w-10" />
              <p className="mt-4 text-lg font-semibold">Verification failed</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : (
            <div className="rounded-3xl bg-emerald-50 p-8 text-slate-900">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
                <div>
                  <h2 className="text-xl font-semibold">Certificate is valid</h2>
                  <p className="text-sm text-slate-600">Verified successfully for certificate ID <span className="font-semibold">{certificate.certificateId}</span>.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.15em]">Type</h3>
                  <p className="mt-2 text-slate-900">{certificate.certificateType}</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.15em]">Issued On</h3>
                  <p className="mt-2 text-slate-900">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm col-span-full sm:col-span-2">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-[0.15em]">Student</h3>
                  <p className="mt-2 text-slate-900">{certificate.studentName || 'Unknown'}</p>
                  <p className="text-sm text-slate-500">{certificate.track || ''}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={() => router.back()} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200 transition-colors">Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}
