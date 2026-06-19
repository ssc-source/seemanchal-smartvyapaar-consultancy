"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RazorpayCheckout from '@/components/RazorpayCheckout';
import { getApiBase, createOrder, verifyPayment } from '@/lib/payments';
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

export default function AssessmentRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [order, setOrder] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutState, setCheckoutState] = useState('idle'); // idle, created, open, failed, dismissed
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [studentRes, quizRes] = await Promise.all([
          fetch(`${getApiBase()}/api/student/me`, { credentials: 'include' }),
          fetch(`${getApiBase()}/api/quizzes`, { credentials: 'include' }),
        ]);

        const studentJson = await studentRes.json();
        let track = 'Full Stack';
        if (studentRes.ok && studentJson.success) {
          setStudentData(studentJson.data);
          if (studentJson.data?.student?.track) {
            track = studentJson.data.student.track;
          }
        }

        const quizJson = await quizRes.json();
        if (quizRes.ok && quizJson.success && Array.isArray(quizJson.data) && quizJson.data.length > 0) {
          const matchedQuiz = quizJson.data.find(q => 
            q.title.toLowerCase().includes(track.toLowerCase())
          ) || quizJson.data[0];
          setQuiz(matchedQuiz);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load assessment details. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const studentSignedIn = !!studentData?.student;

  const handleCreateOrder = async () => {
    if (!quiz) return;
    setError(null);
    setSubmitting(true);
    setCheckoutState('idle');
    setShowCancel(false);

    try {
      const payload = {
        quizExamId: quiz.id,
        amount: Number(process.env.NEXT_PUBLIC_ASSESSMENT_PRICE || 199),
        phone: studentData?.student?.phone || undefined,
      };

      console.log('[AssessmentRegisterPage] createOrder request', payload);
      const res = await createOrder(payload);
      console.log('[AssessmentRegisterPage] createOrder response', res);
      if (!res || !res.success) {
        throw new Error(res?.message || 'Failed to create order');
      }

      setOrder(res.data.order);
      setRegistration(res.data.registration);
      setCheckoutState('created');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to create registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckoutOpen = () => {
    console.log('[AssessmentRegisterPage] checkout opened');
    setCheckoutState('open');
    setShowCancel(false);
  };

  const handleCheckoutDismiss = () => {
    console.log('[AssessmentRegisterPage] checkout dismissed');
    setCheckoutState('dismissed');
    setError('Payment window was closed. Please try again or cancel.');
    setShowCancel(true);
  };

  const handlePaymentSuccess = async (payload) => {
    console.log('[AssessmentRegisterPage] payment success payload', payload);
    if (!registration?.id) {
      setError('Missing registration information. Please try again.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await verifyPayment({ ...payload, registrationId: registration.registrationId || registration.id });
      console.log('[AssessmentRegisterPage] verifyPayment response', res);
      if (!res || !res.success) {
        throw new Error(res?.message || 'Payment verification failed');
      }
      const startId = registration.registrationId || registration.id;
      router.push(`/career/assessment/start/${startId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Payment verification failed');
      setShowCancel(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentError = (err) => {
    setError(err?.message || 'Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Register for Assessment</h1>
              <p className="mt-2 text-slate-600 sm:max-w-xl">
                Complete your registration and pay the ₹199 fee to unlock the assessment attempt. Once payment clears, you will be taken to the quiz start page.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 border border-slate-200 px-5 py-4 text-center">
              <p className="text-sm text-slate-500">Assessment Fee</p>
              <p className="text-3xl font-bold text-slate-900">₹{process.env.NEXT_PUBLIC_ASSESSMENT_PRICE || 199}</p>
            </div>
          </div>
        </div>

        {!studentSignedIn ? (
          <div className="rounded-3xl bg-white border border-red-200 p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-red-700">You must be signed in to register.</p>
            <p className="text-sm text-slate-600 mt-2">Sign in to continue with assessment registration and payment.</p>
            <Link href="/auth/login" className="inline-flex mt-6 items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition">
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <p className="text-sm text-slate-500">Student Name</p>
                <p className="text-lg font-semibold text-slate-900">{studentData.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="text-lg font-semibold text-slate-900">{studentData.student.email}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 mb-6">
              <p className="text-sm text-slate-500">Assessment</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{quiz?.title || 'Final Internship Assessment'}</h2>
              <p className="mt-2 text-sm text-slate-600">{quiz?.description || 'A 60-minute assessment with certificate issued on passing.'}</p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {order ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-blue-50 border border-blue-200 p-5">
                  <p className="text-sm text-slate-600">Complete payment to activate your assessment registration.</p>
                  <p className="mt-2 text-xl font-semibold text-blue-900">₹{(order.amount / 100).toFixed(2)} {order.currency || 'INR'}</p>
                </div>
                {checkoutState === 'created' && (
                  <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4 text-slate-700 mb-4">
                    <p className="text-sm">Opening payment window... please allow Razorpay to load.</p>
                  </div>
                )}
                {checkoutState === 'open' && (
                  <div className="rounded-2xl bg-slate-100 border border-slate-200 p-4 text-slate-700 mb-4">
                    <p className="text-sm">Payment window is open. Complete payment to continue.</p>
                  </div>
                )}
                <RazorpayCheckout
                  order={order}
                  autoOpen={checkoutState === 'created'}
                  onOpen={handleCheckoutOpen}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onDismiss={handleCheckoutDismiss}
                />
                {showCancel && (
                  <button
                    type="button"
                    onClick={() => {
                      setOrder(null);
                      setRegistration(null);
                      setError(null);
                      setCheckoutState('idle');
                      setShowCancel(false);
                    }}
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel and choose again
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-100 p-6">
                  <p className="text-sm text-slate-600">Ready to register?</p>
                  <p className="text-2xl font-semibold text-slate-900">₹{process.env.NEXT_PUBLIC_ASSESSMENT_PRICE || 199}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateOrder}
                  // disabled={submitting || !quiz}
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                  {submitting ? 'Starting payment...' : 'Register & Pay'}
                </button>
                <p className="text-xs text-slate-500 text-center">You will be redirected to the assessment once payment is completed.</p>
              </div>
            )}
          </div>
        )}

        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-3 text-slate-900 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold">What happens next?</h2>
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>1. Create a registration and pay the assessment fee.</li>
            <li>2. Razorpay will collect payment and verify the transaction.</li>
            <li>3. Your registration will activate and you will be redirected to the quiz start page.</li>
            <li>4. Complete the assessment, submit your answers, and receive a certificate if you pass.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
