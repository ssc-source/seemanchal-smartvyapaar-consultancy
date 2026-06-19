"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiBase } from "@/lib/payments";
import {
  CheckCircle,
  Clock,
  FileText,
  Award,
  User,
  Briefcase,
  BookOpen,
  Download,
  Send,
  LogOut,
  Eye,
  ArrowRight,
  Loader2,
  TrendingUp,
  CreditCard,
} from "lucide-react";

// Status Badge Component for Application Status
const StatusBadge = ({ status }) => {
  const statusConfig = {
    NOT_APPLIED: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', label: 'Not Applied' },
    COMPLETED: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Completed' },
    APPLIED: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Applied' },
    SCREENING: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Screening' },
    SHORTLISTED: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', label: 'Shortlisted' },
    SELECTED: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', label: 'Selected' },
    ONBOARDED: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', label: 'Onboarded' },
    REJECTED: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Rejected' },
  };
  const config = statusConfig[status] || statusConfig.NOT_APPLIED;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.border} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Assessment Status Badge Component
const AssessmentStatusBadge = ({ registrations, hasApplication }) => {
  if (!hasApplication) {
    return <span className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 uppercase tracking-wider">Awaiting Application</span>;
  }

  // Find the latest registration (registrations is sorted by createdAt DESC)
  const latestReg = registrations && registrations[0];

  if (latestReg) {
    const regAttempts = latestReg.attempts || [];
    const hasAttempt = regAttempts.length > 0;

    if (hasAttempt) {
      // Sort attempts descending by completion date
      const sortedAttempts = [...regAttempts].sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
      const lastAttempt = sortedAttempts[0];
      if (lastAttempt.passed) {
        return <span className="inline-flex items-center rounded-full bg-green-50 border border-green-300 px-3 py-1 text-xs font-semibold text-green-700 uppercase tracking-wider">Passed ✓</span>;
      }
      return <span className="inline-flex items-center rounded-full bg-red-50 border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 uppercase tracking-wider">Failed</span>;
    }

    if (latestReg.paymentStatus === 'paid' && latestReg.status === 'activated') {
      return <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wider">Ready to Attempt</span>;
    }
  }

  return <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-700 uppercase tracking-wider">Open to Register</span>;
};

const timelineSteps = [
  { id: 1, label: "Applied", icon: Briefcase },
  { id: 2, label: "Selected", icon: CheckCircle },
  { id: 3, label: "Onboarded", icon: User },
  { id: 4, label: "In Progress", icon: Clock },
  { id: 5, label: "Completed", icon: CheckCircle },
  { id: 6, label: "Assessment Open", icon: BookOpen },
  { id: 7, label: "Assessment Purchased", icon: Send },
  { id: 8, label: "Assessment Completed", icon: FileText },
  { id: 9, label: "Certified", icon: Award },
];

export default function StudentDashboard() {
  const router = useRouter();
  const [studentData, setStudentData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudentProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${getApiBase()}/api/student/me`, { credentials: 'include' });
      
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("studentAuthenticated");
        }
        router.push("/auth/login");
        return;
      }

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to load student data');
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("studentAuthenticated", "true");
      }

      const student = json.data.student;
      const application = json.data.application;
      const registrations = json.data.registrations || [];
      const certificates = json.data.certificates || [];
      const latestCertificate = certificates[0] || null;
      
      const hasApplication = !!application;
      const applicationStatus = application?.status || 'NOT_APPLIED';
      const internshipCompleted = applicationStatus === 'COMPLETED';
      const assessmentOpen = hasApplication;
      const assessmentEligible = internshipCompleted;
      
      const paidReg = registrations.find(r => r.paymentStatus === 'paid' && r.status === 'activated');
      const assessmentPurchased = !!paidReg;

      const attempts = [];
      registrations.forEach(reg => {
        if (reg.attempts) {
          attempts.push(...reg.attempts);
        }
      });
      const lastAttempt = attempts.length > 0 ? attempts[0] : null;
      const hasPassed = attempts.some(a => a.passed);
      const canStartQuiz = paidReg && (!paidReg.attempts || paidReg.attempts.length === 0);
      
      // Calculate Timeline Step
      let calculatedStep = 1;
      if (!hasApplication) {
        calculatedStep = 0;
      } else if (applicationStatus === 'APPLIED') {
        calculatedStep = 1;
      } else if (['SCREENING', 'SHORTLISTED', 'SELECTED'].includes(applicationStatus)) {
        calculatedStep = 2;
      } else if (applicationStatus === 'ONBOARDED') {
        calculatedStep = 3;
      } else if (applicationStatus === 'IN_PROGRESS') {
        calculatedStep = 4;
      } else if (internshipCompleted) {
        calculatedStep = 5;
        if (assessmentOpen) {
          calculatedStep = 6;
        }
        if (assessmentPurchased) {
          calculatedStep = 7;
        }
        if (attempts.length > 0) {
          calculatedStep = 8;
        }
        if ((student.certificateIssued || hasPassed) && certificates.length > 0) {
          calculatedStep = 9;
        }
      }

      setStudentData({
        student,
        application,
        registrations,
        certificates,
        assessmentPurchased,
        latestCertificate,
        assessmentEligible,
        assessmentOpen,
        hasApplication,
        applicationStatus,
        internshipCompleted,
        attempts,
        lastAttempt,
        hasPassed,
        canStartQuiz,
        calculatedStep,
      });
      setCurrentStep(calculatedStep);
    } catch (err) {
      setError(err.message || 'Unable to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch(`${getApiBase()}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("studentAuthenticated");
      }
      window.location.href = "/auth/login";
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchStudentProfile();
    }, 0);
  }, [fetchStudentProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-2xl max-w-md w-full shadow-lg">
          <h2 className="text-lg font-bold mb-2">Error Loading Profile</h2>
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchStudentProfile}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!studentData || !studentData.student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600" />
          <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Session Expired</h2>
          <p className="text-slate-600 mb-6 text-sm">Please log in to view your student dashboard.</p>
          <Link href="/auth/login">
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300">
              Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    student,
    registrations,
    certificates,
    assessmentPurchased,
    latestCertificate,
    assessmentEligible,
    assessmentOpen,
    hasApplication,
    applicationStatus,
    internshipCompleted,
    attempts,
    lastAttempt,
    hasPassed,
    canStartQuiz,
  } = studentData;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 select-none">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome, {student.name}!
            </h1>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Track your internship journey, view assessments, and manage certificates.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl text-slate-700 transition-all duration-300 text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-xs hover:shadow-md self-start sm:self-auto"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Dynamic Banners depending on current state */}
        <div className="space-y-4">
          {assessmentEligible && !assessmentPurchased && !hasPassed && (
            <div className="bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 animate-pulse" />
                  Assessment Ready!
                </h3>
                <p className="text-blue-100 mt-1 text-sm">
                  Your internship is complete. Register for the assessment exam to earn your certificate.
                </p>
              </div>
              <Link href="/career/assessment">
                <button className="px-6 py-2.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap">
                  Register Now
                </button>
              </Link>
            </div>
          )}

          {canStartQuiz && !hasPassed && (
            <div className="bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 animate-pulse" />
                  Assessment In Progress
                </h3>
                <p className="text-orange-100 mt-1 text-sm">
                  Your assessment payment is verified. You are ready to start the final exam.
                </p>
              </div>
              <Link href="/career/assessment">
                <button className="px-6 py-2.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors shadow-sm whitespace-nowrap">
                  Start Quiz
                </button>
              </Link>
            </div>
          )}

          {(student.certificateIssued || hasPassed) && latestCertificate && (
            <div className="bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certificate Issued! 🎉
                </h3>
                <p className="text-emerald-100 mt-1 text-sm">
                  Congratulations! Your certificate is generated. Download or verify it using the buttons.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a 
                  href={`/career/certificate/${latestCertificate.certificateId}`}
                  className="px-5 py-2.5 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors shadow-sm text-sm"
                >
                  Download
                </a>
                <Link href={`/career/certificate/verify/${latestCertificate.certificateId}`}>
                  <button className="px-5 py-2.5 bg-emerald-700 text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors text-sm">
                    Verify
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation Layout */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tabs Selector */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 overflow-x-auto gap-2">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "assessments", label: "Assessments", icon: BookOpen },
              { id: "payments", label: "Payments", icon: CreditCard },
              { id: "certificates", label: "Certificates", icon: Award }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? "bg-white text-blue-600 shadow-xs border border-slate-200" 
                      : "text-slate-600 hover:bg-slate-100/50"
                  }`}
                >
                  <TabIcon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active Tab View */}
          <div className="p-6 sm:p-8">
            
            {/* 1. OVERVIEW VIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                
                {/* Profile Card */}
                <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 text-lg mb-4">Student Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Name</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Email</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">{student.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Registration ID</p>
                      <p className="text-base font-mono font-semibold text-slate-900 mt-1">{student.registrationId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Internship Track</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">{student.track || 'Not assigned yet'}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline Journey Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Internship Progress</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Your official timeline and milestone achievements.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-semibold uppercase">Status:</span>
                      <StatusBadge status={applicationStatus} />
                    </div>
                  </div>

                  {!hasApplication ? (
                    <div className="text-center py-8">
                      <p className="text-slate-600 mb-6">You have not submitted an internship application yet.</p>
                      <Link href="/career/apply">
                        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                          Apply For Internship
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="relative">
                        {/* Timeline Progress Line (Desktop) */}
                        <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 hidden md:block">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / (timelineSteps.length - 1)) * 100}%` }}
                          />
                        </div>

                        {/* Timeline Steps Grid */}
                        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-4 md:gap-2">
                          {timelineSteps.map((step) => {
                            const Icon = step.icon;
                            const isCompleted = currentStep > step.id;
                            const isCurrent = currentStep === step.id;

                            return (
                              <div key={step.id} className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                                    isCompleted
                                      ? "bg-emerald-600 text-white"
                                      : isCurrent
                                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                      : "bg-slate-100 text-slate-600 border border-slate-200"
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <p className={`text-xs text-center leading-tight font-medium ${isCurrent ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>{step.label}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. ASSESSMENTS TAB */}
            {activeTab === "assessments" && (
              <div className="space-y-8">
                
                {/* Eligibility and Summary Card */}
                <div className="rounded-2xl border border-slate-200 p-6 bg-slate-50/50">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">Final Assessment Info</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Your assessment details, status, and scores.</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-slate-400" />
                  </div>

                  <div className="grid gap-6 md:grid-cols-3 border-t border-slate-200/60 pt-6">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Availability</p>
                      <p className="text-base font-semibold text-slate-900 mt-1">
                        {assessmentOpen ? "Open to Register" : "Requires Application"}
                      </p>
                      {assessmentOpen && !internshipCompleted && (
                        <p className="text-[11px] text-slate-400">Registration is open during your internship.</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Registration Badge</p>
                      <div className="mt-1">
                        <AssessmentStatusBadge registrations={registrations} hasApplication={hasApplication} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Latest Score</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        {lastAttempt?.score !== undefined ? `${lastAttempt.score}%` : "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Trigger */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 text-base mb-4">Assessment Navigation</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {assessmentOpen && !lastAttempt && (
                      <button
                        onClick={() => router.push('/career/assessment')}
                        className="flex items-center justify-between rounded-xl bg-blue-600 text-white px-6 py-4 font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                      >
                        <span>Register for Assessment</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}
                    {lastAttempt && !lastAttempt.passed && (
                      <button
                        onClick={() => router.push('/career/assessment')}
                        className="flex items-center justify-between rounded-xl bg-orange-600 text-white px-6 py-4 font-semibold hover:bg-orange-700 transition-colors shadow-xs"
                      >
                        <span>Retake Assessment</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    )}
                    {latestCertificate && (
                      <a
                        href={`/career/certificate/${latestCertificate.certificateId}`}
                        className="flex items-center justify-between rounded-xl border border-green-600 text-green-700 px-6 py-4 font-semibold hover:bg-green-50 transition-colors shadow-xs"
                      >
                        <span>Download Passed Certificate</span>
                        <Download className="h-5 w-5" />
                      </a>
                    )}
                    {!assessmentOpen && (
                      <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 font-semibold text-sm">
                        Please submit your internship application to register for final assessments.
                      </div>
                    )}
                  </div>
                </div>

                {/* History log */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-800 text-lg mb-6">Assessment History</h3>
                  {attempts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">No assessment attempts logged yet.</div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-100 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                            <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Score</th>
                            <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Result</th>
                            <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attempts.map((attempt, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-4 text-sm text-slate-700">
                                {new Date(attempt.completedAt).toLocaleDateString()}
                              </td>
                              <td className="py-3.5 px-4 text-sm font-bold text-slate-900">{attempt.score}%</td>
                              <td className="py-3.5 px-4 text-sm">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  attempt.passed 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {attempt.passed ? 'Passed' : 'Failed'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-sm text-slate-600">
                                {attempt.durationSeconds ? `${Math.round(attempt.durationSeconds / 60)} min` : "0 min"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">Payment History</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Records of your assessment registration payments.</p>
                </div>

                {registrations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">No transaction records found.</div>
                ) : (
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                          <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Reference ID</th>
                          <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                          <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Payment Status</th>
                          <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Transaction Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((reg) => (
                          <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4 text-sm font-mono text-slate-700">{reg.paymentReference}</td>
                            <td className="py-3.5 px-4 text-sm font-bold text-slate-900">₹{reg.amount || 199}</td>
                            <td className="py-3.5 px-4 text-sm">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                reg.paymentStatus === 'paid'
                                  ? 'bg-green-100 text-green-700'
                                  : reg.paymentStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {reg.paymentStatus === 'paid' ? 'Paid' : reg.paymentStatus === 'pending' ? 'Pending' : 'Failed'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-sm text-slate-600">
                              {new Date(reg.registeredAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. CERTIFICATES TAB */}
            {activeTab === "certificates" && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-slate-800 text-lg">My Certificates</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Download or verify credentials earned during your internship.</p>
                </div>

                {certificates.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-800 text-base mb-1">No Certificates Issued Yet</h4>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto leading-normal">
                      Certificates are issued immediately after passing the final assessment with a score of 60% or higher.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/20 shadow-xs flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-xl">
                              <Award className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">Internship Merit Certificate</h4>
                              <p className="text-slate-500 text-xs font-mono mt-0.5">{cert.certificateId}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4 text-xs">
                            <div>
                              <p className="text-slate-400 font-medium uppercase tracking-wider">Credential Type</p>
                              <p className="text-slate-800 font-semibold mt-1">{cert.certificateType}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 font-medium uppercase tracking-wider">Issue Date</p>
                              <p className="text-slate-800 font-semibold mt-1">
                                {new Date(cert.issuedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <a 
                            href={`/career/certificate/${cert.certificateId}`}
                            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2.5 text-xs font-semibold hover:bg-slate-800 transition-colors text-center"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </a>
                          <Link href={`/career/certificate/verify/${cert.certificateId}`}>
                            <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
                              <Eye className="h-4 w-4" />
                              Verify
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
