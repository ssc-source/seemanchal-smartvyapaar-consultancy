"use client";
import {use} from 'react';

import React, { useEffect, useState } from 'react';
import { getApiBase } from '@/lib/payments';
import { useRouter } from 'next/navigation';
import { 
  Download, Share2, CheckCircle, AlertCircle, 
  Loader2, Eye, Copy, ExternalLink
} from 'lucide-react';

export default function CertificatePage({ params }) {
  // const certificateId = params.certificateId;
  const { certificateId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/certificates/verify/${certificateId}`, {
          credentials: 'include'
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setCert(json.data);
        } else {
          setError(json.message || 'Certificate not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [certificateId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cert.verificationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!cert?.pdfUrl) {
      alert('Certificate PDF is not available for download.');
      return;
    }

    setDownloading(true);
    try {
      const downloadUrl = `${getApiBase()}/api/certificates/${certificateId}/download`;
      window.location.href = downloadUrl;
    } catch (err) {
      console.error(err);
      alert('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cert?.verificationUrl) {
      alert('Certificate verification link is not available.');
      return;
    }

    const verificationUrl = cert.verificationUrl;
    const shareText = `I have completed my internship with SSC and earned a certificate! Verify it here: ${verificationUrl}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My SSC Certificate',
          text: shareText,
          url: verificationUrl
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(verificationUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Certificate Not Found</h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard/internship')}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-slate-50 to-white">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Certificate Data</h1>
          <p className="text-slate-600 mb-6">Unable to load certificate information</p>
          <button
            onClick={() => router.push('/dashboard/internship')}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-6 py-3 font-semibold hover:bg-slate-800 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/internship')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Certificate</h1>
          <p className="text-slate-600 mt-2">Your internship completion certificate</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Certificate Preview */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-lg overflow-hidden">
              {/* Certificate Body */}
              <div className="p-8 md:p-12 text-center bg-linear-to-br from-slate-50 to-white relative">
                {/* Decorative border */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-dashed border-slate-300 rounded-lg" />
                </div>

                <div className="relative z-10">
                  {/* Logo/Badge */}
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl font-bold text-slate-900 mb-2">Certificate of Completion</h2>
                  <p className="text-slate-600 mb-8">SSC Internship Program</p>

                  {/* Main content */}
                  <div className="mb-8">
                    <p className="text-slate-600 mb-4">This is to certify that</p>
                    <h3 className="text-2xl font-bold text-slate-900 border-b-2 border-slate-900 pb-4 mb-4">
                      {cert.student?.name || 'Student'}
                    </h3>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                      has successfully completed the SSC Internship Program and the Final Assessment, 
                      demonstrating proficiency in {cert.student?.track || 'technical skills'} development.
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-6 py-8 px-6 bg-slate-50 rounded-lg mb-8">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Certificate ID</p>
                      <p className="text-lg font-bold text-slate-900 mt-2">{cert.certificateId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Type</p>
                      <p className="text-lg font-bold text-slate-900 mt-2">{cert.certificateType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase">Issued Date</p>
                      <p className="text-lg font-bold text-slate-900 mt-2">
                        {new Date(cert.issuedAt).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Signature area */}
                  <div className="border-t border-slate-300 pt-8">
                    <p className="text-sm text-slate-600">Verified by Seemanchal Smart Vyapaar Consultancy</p>
                    <p className="text-xs text-slate-500 mt-2">Certificate verification code: {cert.verificationCode}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {cert.qrCodeUrl && (
                <div className="bg-slate-100 p-6 flex flex-col items-center gap-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-600">Scan to verify</p>
                  <img 
                    src={cert.qrCodeUrl} 
                    alt="Certificate verification QR code"
                    className="w-32 h-32 border-2 border-white rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Download Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Download</h3>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-3 font-semibold transition-colors"
              >
                {downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                {downloading ? 'Downloading...' : 'Download PDF'}
              </button>
              <p className="text-xs text-slate-500 text-center mt-2">Save for your records</p>
            </div>

            {/* Verification Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Verification
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-medium mb-2">Verification Code</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cert.verificationCode}
                      readOnly
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono text-slate-600"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  {copied && <p className="text-xs text-green-600 mt-1">✓ Copied</p>}
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-600 mb-3">Share verification link</p>
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Open in new tab
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Share</h3>
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 hover:border-slate-400 text-slate-900 px-4 py-3 font-semibold transition-colors"
              >
                <Share2 className="h-5 w-5" />
                Share Certificate
              </button>
              <p className="text-xs text-slate-500 text-center mt-2">Share on social media or copy link</p>
            </div>

            {/* Info Section */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Certificate Details
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Student:</strong> {cert.student?.name}</p>
                <p><strong>Track:</strong> {cert.student?.track}</p>
                <p><strong>Type:</strong> {cert.certificateType}</p>
                <p><strong>Status:</strong> <span className="text-green-700 font-semibold">✓ Verified</span></p>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push('/dashboard/internship')}
              className="w-full rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-900 px-4 py-3 font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}