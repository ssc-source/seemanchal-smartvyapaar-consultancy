"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApiBase } from '@/lib/payments';
import { 
  CheckCircle, AlertCircle, Loader2, ArrowRight, 
  Zap, Clock, Target, Trophy, Users, BookOpen 
} from 'lucide-react';

const BenefitItem = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4">
    <Icon className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
    <div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </div>
  </div>
);

const EligibilityItem = ({ met, text }) => (
  <div className="flex items-center gap-3 py-3">
    <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${met ? 'bg-green-100' : 'bg-red-100'}`}>
      {met ? <CheckCircle className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
    </div>
    <span className={`text-sm ${met ? 'text-green-700' : 'text-red-700'}`}>{text}</span>
  </div>
);

export default function AssessmentPage() {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/student/me`, { credentials: 'include' });
        const json = await res.json();
        if (res.ok && json.success) {
          setStudentData(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const internshipComplete = studentData?.application?.status === 'COMPLETED';
  const hasStudentProfile = !!studentData?.student;
  const isEligible = hasStudentProfile;


  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="min-h-screen p-12 bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Final Assessment & Certificate</h1>
          <p className="mt-2 text-lg text-slate-600">Complete your internship assessment and earn your certificate</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3 mb-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assessment Overview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Assessment Overview
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  The Final Assessment is a comprehensive evaluation of the skills you've developed during your internship. 
                  This assessment validates your technical knowledge and practical capabilities.
                </p>
                <div className="grid gap-4 md:grid-cols-3 pt-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-2xl font-bold text-blue-600">₹199</p>
                    <p className="text-sm text-slate-600 mt-2">Assessment Fee</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <p className="text-2xl font-bold text-purple-600">30 min</p>
                    <p className="text-sm text-slate-600 mt-2">Time Limit</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <p className="text-2xl font-bold text-green-600">60%</p>
                    <p className="text-sm text-slate-600 mt-2">Passing Marks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-amber-600" />
                Benefits
              </h2>
              <div className="space-y-6">
                <BenefitItem 
                  icon={Trophy}
                  title="Professional Certificate"
                  description="Earn an industry-recognized certificate upon successful completion of the assessment"
                />
                <BenefitItem 
                  icon={Target}
                  title="Skill Validation"
                  description="Get your technical skills formally validated and documented"
                />
                <BenefitItem 
                  icon={Users}
                  title="Career Enhancement"
                  description="Add verified internship completion to your resume and LinkedIn profile"
                />
                <BenefitItem 
                  icon={Clock}
                  title="Flexible Scheduling"
                  description="Attempt the assessment at your own pace after payment"
                />
              </div>
            </div>

            {/* Eligibility Requirements */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-blue-600" />
                Eligibility Requirements
              </h2>
              <div className="space-y-3 divide-y">
                <EligibilityItem 
                  met={!!studentData?.application}
                  text="Active internship application"
                />
                <EligibilityItem 
                  met={studentData?.application?.status === 'COMPLETED'}
                  text="Completed internship program"
                />
                <EligibilityItem 
                  met={!!studentData?.student}
                  text="Open to any enrolled student"
                />
              </div>
              <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">
                  Assessment registration is open. Certificate issuance is based on passing score (60% or higher).
                </p>
                {!internshipComplete && (
                  <p className="text-xs text-amber-700 mt-2">
                    Your internship is not marked complete yet. You can still register now and attempt the assessment.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Registration */}
          <div>
            <div className="rounded-2xl border-2 p-8 shadow-sm sticky top-6 bg-linear-to-br from-blue-50 to-indigo-50 border-blue-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Registration</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-2xl font-bold text-slate-900">₹{process.env.NEXT_PUBLIC_ASSESSMENT_PRICE || 199}</p>
                  <p className="text-sm text-slate-600 mt-1">One-time assessment fee</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">Includes:</p>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Full assessment access
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      60 minute timer
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Instant results & feedback
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Certificate on passing
                    </li>
                  </ul>
                </div>

                <Link href="/career/assessment/register">
                  <button
                    disabled={!hasStudentProfile}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
                  >
                    <ArrowRight className="h-5 w-5" />
                    Register Here
                  </button>
                </Link>

                {!hasStudentProfile && (
                  <div className="mt-4">
                    <p className="text-sm text-red-700 text-center mb-3">
                      Please sign in to register for the assessment.
                    </p>
                    <Link href="/auth/login">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Sign In
                      </button>
                    </Link>
                  </div>
                )}

                <p className="text-xs text-slate-500 text-center mt-4">
                  Secure payment powered by Razorpay. Your data is encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-slate-900">Can I retake the assessment?</h3>
              <p className="text-sm text-slate-600 mt-2">Yes, you can retake the assessment after 7 days if you don't pass on the first attempt. Each attempt requires a separate ₹199 payment.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">When will I get my certificate?</h3>
              <p className="text-sm text-slate-600 mt-2">Certificates are issued immediately upon successful completion (score ≥ 60%). You can download it from your dashboard.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Is my payment refundable?</h3>
              <p className="text-sm text-slate-600 mt-2">Yes, we offer a 7-day money-back guarantee if you're not satisfied with the assessment.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">What happens if time runs out?</h3>
              <p className="text-sm text-slate-600 mt-2">Your answers will be automatically submitted when the 60-minute timer ends.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//   const handlePaymentSuccess = async (payload) => {
//     if (!registration?.id) return alert('Missing registration info');
//     setVerifying(true);
//     try {
//       const res = await verifyPayment({ ...payload, registrationId: registration.id });
//       if (!res.success) throw new Error(res.message || 'Verification failed');
//       // redirect to assessment start
//       window.location.href = `/career/assessment/start/${registration.id}`;
//     } catch (err) {
//       console.error(err);
//       alert(err.message || 'Payment verification failed');
//     } finally {
//       setVerifying(false);
//     }
//   };

//   if (loading) return <div className="p-8">Loading...</div>;

//   return (
//     <div className="max-w-4xl mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-4">Final Assessment & Certificate</h1>

//       <div className="mb-6">
//         <p className="text-lg">Eligibility: Complete your internship and be marked eligible in your student profile.</p>
//         <p className="text-lg">Fee: ₹199</p>
//         <p className="text-lg">Benefits: Final assessment, certificate (Internship) on passing, QR verification link.</p>
//       </div>

//       {!eligible ? (
//         <div className="rounded-lg border p-6">You are not eligible to register for the assessment. Complete your internship first.</div>
//       ) : (
//         <div className="space-y-4">
//           <div className="rounded-lg border p-6">
//             <h2 className="font-semibold mb-2">Selected Assessment</h2>
//             <div className="text-lg">{selectedQuiz ? selectedQuiz.title : 'No assessment available'}</div>
//             <div className="text-sm text-slate-500 mt-2">{selectedQuiz ? selectedQuiz.description : ''}</div>
//           </div>

//           <div>
//             {order ? (
//               <RazorpayCheckout order={order} onSuccess={handlePaymentSuccess} onError={(e) => alert(e.message || 'Payment error')} />
//             ) : (
//               <button onClick={handleRegister} className="inline-flex items-center gap-3 rounded-2xl bg-brand-accent px-6 py-3 text-white font-semibold">Register & Pay ₹199</button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
