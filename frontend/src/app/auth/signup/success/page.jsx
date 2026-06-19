"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

function SignupSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const registrationId = searchParams.get('registrationId') || '';
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(registrationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const goToDashboard = () => router.push('/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white p-6">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-8 md:p-12 text-center">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Account Created Successfully</h1>

          <p className="text-sm text-slate-600 mb-6">Your account has been created. Below is your Registration ID — keep it safe.</p>

          <div className="mx-auto mb-4 max-w-md">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 justify-between">
              <div className="text-left">
                <p className="text-xs text-slate-500">Registration ID</p>
                <p className="font-mono text-lg font-semibold text-slate-900 break-all">{registrationId || '—'}</p>
              </div>
              <div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-4 max-w-lg mx-auto">Keep this Registration ID safe. You will use it to log in and access internship, quiz, and certificate services. A confirmation email has also been sent to your inbox.</p>

          <p className="text-xs font-semibold text-blue-600 mb-6 flex items-center justify-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Redirecting to your student dashboard in {countdown} seconds...
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button onClick={goToDashboard} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg cursor-pointer">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>

            <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 border border-slate-200 px-6 py-3 rounded-lg text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    }>
      <SignupSuccessContent />
    </Suspense>
  );
}
