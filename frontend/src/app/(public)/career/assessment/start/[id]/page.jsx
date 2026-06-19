"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { getApiBase } from '@/lib/payments';
import { useRouter, useParams } from 'next/navigation';
import { 
  Loader2, ChevronLeft, ChevronRight, Flag, 
  CheckCircle, AlertCircle, Clock, Send, BookOpen, ArrowRight
} from 'lucide-react';

const Timer = ({ timeLeft, onTimeUp }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 300; // 5 minutes

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold ${
      isWarning 
        ? 'bg-red-100 text-red-700 border-2 border-red-300' 
        : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
    }`}>
      <Clock className="h-5 w-5" />
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
};

const ProgressBar = ({ current, total }) => {
  const progress = (current / total) * 100;
  return (
    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
      <div 
        className="bg-blue-600 h-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const QuestionIndicator = ({ questionNumber, totalQuestions, answered, flagged, onSelect }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-600">Question {questionNumber} of {totalQuestions}</p>
        <p className="text-xs text-slate-500">{answered} answered</p>
      </div>
      <ProgressBar current={questionNumber} total={totalQuestions} />
    </div>
  );
};


// Security configuration for anti-cheating
const SECURITY_CONFIG = {
  immediateTermination: false, // Set to true to auto-submit on first violation
  maxAllowedWarnings: 2,       // 1st violation warns, 2nd violation terminates/submits
};

const getCheatingStats = (registrationId) => {
  if (typeof window === "undefined" || !registrationId) {
    return { warningCount: 0, cheated: false };
  }
  const key = `assessment_warnings_${registrationId}`;
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : { warningCount: 0, cheated: false };
  } catch (e) {
    console.error("Failed to read sessionStorage", e);
    return { warningCount: 0, cheated: false };
  }
};

const saveCheatingStats = (registrationId, stats) => {
  if (typeof window === "undefined" || !registrationId) return;
  const key = `assessment_warnings_${registrationId}`;
  try {
    sessionStorage.setItem(key, JSON.stringify(stats));
  } catch (e) {
    console.error("Failed to save sessionStorage", e);
}
};

const getInstructionsTimer = (registrationId) => {
  if (typeof window === "undefined" || !registrationId) return null;
  const key = `assessment_instructions_start_${registrationId}`;
  try {
    const val = localStorage.getItem(key);
    if (!val) return null;
    const startTime = parseInt(val, 10);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const totalDuration = 600; // 10 minutes = 600 seconds
    return Math.max(0, totalDuration - elapsed);
  } catch (e) {
    console.error("Failed to read localStorage", e);
    return null;
  }
};

const setInstructionsTimerStart = (registrationId) => {
  if (typeof window === "undefined" || !registrationId) return;
  const key = `assessment_instructions_start_${registrationId}`;
  try {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, Date.now().toString());
    }
  } catch (e) {
    console.error("Failed to set localStorage", e);
  }
};

const getQuizTimerLeft = (registrationId, limitMinutes) => {
  const durationMinutes = limitMinutes || 60;
  if (typeof window === "undefined" || !registrationId) return durationMinutes * 60;
  const key = `assessment_quiz_start_${registrationId}`;
  try {
    const val = localStorage.getItem(key);
    if (!val) return durationMinutes * 60;
    const startTime = parseInt(val, 10);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const totalDuration = durationMinutes * 60;
    return Math.max(0, totalDuration - elapsed);
  } catch (e) {
    console.error("Failed to read localStorage", e);
    return durationMinutes * 60;
  }
};

const setQuizTimerStart = (registrationId) => {
  if (typeof window === "undefined" || !registrationId) return;
  const key = `assessment_quiz_start_${registrationId}`;
  try {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, Date.now().toString());
    }
  } catch (e) {
    console.error("Failed to set localStorage", e);
  }
};

const clearQuizTimers = (registrationId) => {
  if (typeof window === "undefined" || !registrationId) return;
  try {
    localStorage.removeItem(`assessment_instructions_start_${registrationId}`);
    localStorage.removeItem(`assessment_quiz_start_${registrationId}`);
  } catch (e) {
    console.error("Failed to clear localStorage", e);
  }
};

export default function AssessmentAttempt() {
  const params = useParams();
  const registrationId = params?.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [result, setResult] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cheatingWarnings, setCheatingWarnings] = useState(0);
  const [showCheatingWarning, setShowCheatingWarning] = useState(false);
  const [cheatingReason, setCheatingReason] = useState("");
  const [flowState, setFlowState] = useState("instructions");
  const [instructionTimeLeft, setInstructionTimeLeft] = useState(600);

  // Anti-copy security protection
  useEffect(() => {
    if (flowState !== "quiz") return;

    const preventAction = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Prevent Ctrl+C, Ctrl+X, Ctrl+A (and Cmd variants on macOS)
      if ((e.ctrlKey || e.metaKey) && ["c", "x", "a", "C", "X", "A"].includes(e.key)) {
        e.preventDefault();
      }
    };

    // Right-click context menu
    document.addEventListener("contextmenu", preventAction);
    // Copy and Cut operations
    document.addEventListener("copy", preventAction);
    document.addEventListener("cut", preventAction);
    // Drag selection
    document.addEventListener("dragstart", preventAction);
    // Key combinations
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", preventAction);
      document.removeEventListener("copy", preventAction);
      document.removeEventListener("cut", preventAction);
      document.removeEventListener("dragstart", preventAction);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [flowState]);

  // Instructions timer initialization
  useEffect(() => {
    if (!registrationId) return;
    
    // If the quiz itself has already started, skip the instructions timer setup entirely
    if (typeof window !== "undefined") {
      const quizStartKey = `assessment_quiz_start_${registrationId}`;
      if (localStorage.getItem(quizStartKey)) {
        setTimeout(() => {
          setFlowState("quiz");
        }, 0);
        return;
      }
    }
    
    setInstructionsTimerStart(registrationId);
    const timeLeft = getInstructionsTimer(registrationId);
    
    if (timeLeft !== null) {
      setTimeout(() => {
        if (timeLeft <= 0) {
          setFlowState("quiz");
        } else {
          setInstructionTimeLeft(timeLeft);
        }
      }, 0);
    }
  }, [registrationId]);

  // Initialize quiz start timer when transitioning to 'quiz'
  useEffect(() => {
    if (flowState === "quiz" && registrationId && quiz) {
      setQuizTimerStart(registrationId);
      const remainingTime = getQuizTimerLeft(registrationId, quiz.timeLimitMinutes);
      setTimeout(() => {
        setTimeLeft(remainingTime);
      }, 0);
    }
  }, [flowState, registrationId, quiz]);

  // Instructions countdown timer
  useEffect(() => {
    if (flowState !== "instructions" || result || loading) return;

    const timer = setInterval(() => {
      setInstructionTimeLeft(prev => {
        const stats = getInstructionsTimer(registrationId);
        if (stats !== null && stats <= 0) {
          clearInterval(timer);
          setFlowState("quiz");
          return 0;
        }
        if (prev <= 1) {
          clearInterval(timer);
          setFlowState("quiz");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flowState, registrationId, result, loading]);

  // Load data
  useEffect(() => {
    const load = async () => {
      if (!registrationId) {
        alert('Invalid registration id');
        router.push('/career/assessment');
        return;
      }

      try {
        // Fetch registration directly (owner-only summary endpoint)
        const regRes = await fetch(`${getApiBase()}/api/payments/${registrationId}/summary`, { credentials: 'include' });
        const regJson = await regRes.json();
        if (!regRes.ok || !regJson.success) {
          console.error('Registration fetch failed', regJson);
          alert(regJson.message || 'Registration not found');
          router.push('/career/assessment');
          return;
        }

        const reg = regJson.data;
        console.log('Registration', reg);
        if (!reg) {
          alert('Registration not found');
          router.push('/career/assessment');
          return;
        }

        if (!['activated', 'paid'].includes(reg.status) || reg.paymentStatus !== 'paid') {
          alert('This registration is not active or paid');
          router.push('/career/assessment');
          return;
        }

        setRegistration(reg);

        // Fetch authenticated student profile for display/context
        const meRes = await fetch(`${getApiBase()}/api/student/me`, { credentials: 'include' });
        const meJson = await meRes.json().catch(() => null);
        if (meRes.ok && meJson && meJson.success) {
          setStudentData(meJson.data);
        }

        // Load quiz using quizExamId from registration
        const quizId = reg.quizExamId || reg.quizId || reg.quiz_exam_id;
        if (!quizId) {
          console.error('Quiz id missing on registration', reg);
          alert('Quiz not found for this registration');
          router.push('/career/assessment');
          return;
        }

        const quizRes = await fetch(`${getApiBase()}/api/quizzes/${quizId}`, { credentials: 'include' });
        const quizJson = await quizRes.json().catch(() => null);
        if (!quizRes.ok || !quizJson || !quizJson.success) {
          console.error('Quiz fetch failed', quizJson);
          alert(quizJson?.message || 'Quiz not found');
          router.push('/career/assessment');
          return;
        }

        console.log('Quiz Data', quizJson.data);
        setQuiz(quizJson.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [registrationId, router]);

  const submitAnswers = useCallback(async (cheatingPayload = null) => {
    if (!quiz) return;
    
    setSubmitting(true);
    const standardAnswers = Object.keys(answers).map(qid => ({ 
      questionId: qid, 
      selectedOption: answers[qid] 
    }));

    const finalAnswers = cheatingPayload 
      ? [...standardAnswers, cheatingPayload]
      : standardAnswers;

    // Retrieve quiz start time to calculate duration
    let durationSeconds = 0;
    let startedAt = new Date();
    if (typeof window !== "undefined" && registrationId) {
      const quizStartKey = `assessment_quiz_start_${registrationId}`;
      const storedStart = localStorage.getItem(quizStartKey);
      if (storedStart) {
        const startMs = parseInt(storedStart, 10);
        startedAt = new Date(startMs);
        durationSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      }
    }

    const payload = { 
      answers: finalAnswers,
      startedAt: startedAt.toISOString(),
      durationSeconds
    };
    console.log('Submit Payload', payload);

    try {
      const res = await fetch(`${getApiBase()}/api/quizzes/${quiz.id}/attempts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.message || 'Failed to submit');
        setSubmitting(false);
        return;
      }

      // Clear the local storage timers on successful submission
      clearQuizTimers(registrationId);

      const { attempt, score, percentage, passed, certificate } = json.data;
      setResult({
        attempt,
        score,
        percentage,
        passed,
        certificate,
        cheated: !!cheatingPayload,
        cheatingReason: cheatingPayload ? cheatingPayload.selectedOption : null,
      });
    } catch (err) {
      console.error(err);
      alert('Submission failed');
      setSubmitting(false);
    }
  }, [quiz, answers, registrationId]);

  const handleAutoSubmit = useCallback(async () => {
    if (result) return; // Already submitted
    await submitAnswers();
  }, [result, submitAnswers]);

  const recordFocusLoss = useCallback(async (reason) => {
    if (result || submitting) return;

    const stats = getCheatingStats(registrationId);
    if (stats.cheated) return;

    const newWarningsCount = stats.warningCount + 1;
    let autoSubmit = false;

    if (SECURITY_CONFIG.immediateTermination || newWarningsCount >= SECURITY_CONFIG.maxAllowedWarnings) {
      stats.cheated = true;
      autoSubmit = true;
    }

    stats.warningCount = newWarningsCount;
    saveCheatingStats(registrationId, stats);

    if (autoSubmit) {
      const cheatingPayload = {
        questionId: "security_violation_metadata",
        selectedOption: `Assessment terminated due to security violation: ${reason}. Total warning violations: ${newWarningsCount}.`
      };
      await submitAnswers(cheatingPayload);
    } else {
      setCheatingWarnings(newWarningsCount);
      setCheatingReason(reason);
      setShowCheatingWarning(true);
    }
  }, [registrationId, result, submitting, submitAnswers]);

  // Timer countdown
  useEffect(() => {
    if (flowState !== "quiz" || result) return; // Don't countdown before quiz starts or after submission

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [flowState, result, handleAutoSubmit]);

  // Anti-cheating proctoring event listeners
  useEffect(() => {
    if (flowState !== "quiz" || !registrationId || !quiz || result || submitting) return;

    const stats = getCheatingStats(registrationId);
    if (stats.cheated) {
      const cheatingPayload = {
        questionId: "security_violation_metadata",
        selectedOption: "Assessment terminated because user attempted to bypass security warning by refreshing the page."
      };
      setTimeout(() => {
        submitAnswers(cheatingPayload);
      }, 0);
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordFocusLoss("Browser tab switched, minimized, or screen locked");
      }
    };

    const handleWindowBlur = () => {
      // Small timeout to prevent false positives from brief focus shifts
      setTimeout(() => {
        if (!document.hasFocus()) {
          recordFocusLoss("Window lost focus (switched application or opened DevTools)");
        }
      }, 150);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [flowState, registrationId, quiz, result, submitting, recordFocusLoss, submitAnswers]);

  const getQuestionOptions = (question) => {
    if (!question) return [];

    const optionValues = Array.isArray(question.options) && question.options.length
      ? question.options
      : question.options && typeof question.options === 'object'
        ? ['A', 'B', 'C', 'D']
          .map((key) => question.options[key] ?? question.options[key.toLowerCase()])
          .filter((value) => value !== undefined && value !== null && value !== '')
        : [question.optionA, question.optionB, question.optionC, question.optionD].filter(
          (value) => value !== undefined && value !== null && value !== ''
        );

    const optionLetters = ['A', 'B', 'C', 'D'];
    return optionValues.map((text, idx) => ({
      label: optionLetters[idx] || `Option ${idx + 1}`,
      text,
    }));
  };

  const handleSelectAnswer = (questionId, optionLabel) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionLabel }));
  };

  const handleToggleFlag = (questionId) => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const totalQuestions = quiz?.QuizQuestions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const currentQ = quiz?.QuizQuestions?.[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100 || 0;

  // Result page
  if (result) {
    const isCheated = result.cheated || getCheatingStats(registrationId).cheated;
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className={`rounded-2xl border-2 p-8 md:p-12 text-center shadow-lg ${
            isCheated 
              ? 'bg-red-50 border-red-300 shadow-red-950/5' 
              : result.passed 
              ? 'bg-green-50 border-green-300 shadow-green-950/5' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isCheated
                ? 'bg-red-100'
                : result.passed 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              {isCheated ? (
                <AlertCircle className="h-8 w-8 text-red-600" />
              ) : result.passed ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-600" />
              )}
            </div>

            <h1 className={`text-4xl font-bold mb-2 ${
              isCheated ? 'text-red-900' : result.passed ? 'text-green-900' : 'text-red-900'
            }`}>
              {isCheated ? 'Assessment Terminated' : result.passed ? 'Congratulations!' : 'Assessment Complete'}
            </h1>

            <p className={`text-lg mb-8 ${
              isCheated ? 'text-red-800' : result.passed ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCheated 
                ? (result.cheatingReason || 'Your assessment was terminated due to security violations (tab switching or focus loss).')
                : result.passed 
                ? 'You have successfully passed the assessment!' 
                : 'You did not pass this time. Feel free to retake the assessment.'}
            </p>

            {!isCheated ? (
              <>
                <div className="bg-white rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-2 gap-6 md:gap-10">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Your Score</p>
                      <p className="text-4xl font-bold text-slate-900 mt-2">{result.percentage}%</p>
                    </div>
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Passing Score</p>
                      <p className="text-4xl font-bold text-slate-900 mt-2">60%</p>
                    </div>
                  </div>
                </div>

                {result.passed && result.certificate && (
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 font-medium">✓ Certificate Generated</p>
                    <p className="text-xs text-blue-700 mt-1">Certificate ID: {result.certificate.certificateId}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white border border-red-200 rounded-xl p-6 mb-8 text-left text-sm text-red-700 shadow-sm">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Proctoring Security Violations Logged
                </h3>
                <p className="mb-2">Your actions violated the assessment policy (tab switching, window focus loss, or window minimization).</p>
                <p className="mb-2">The assessment has been automatically submitted with your answers saved up to the point of termination.</p>
                <p className="text-xs text-slate-500 font-medium mt-4">Note: Attempting to bypass security protections invalidates your eligibility. This event has been flagged for administrative review.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              {isCheated ? (
                <button
                  onClick={() => router.push('/dashboard/internship')}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                >
                  Go to Dashboard
                </button>
              ) : result.passed && result.certificate ? (
                <>
                  <a
                    href={`/career/certificate/${result.certificate.certificateId}`}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
                  >
                    Download Certificate
                  </a>
                  <button
                    onClick={() => router.push('/dashboard/internship')}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/career/assessment')}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Retake Assessment
                  </button>
                  <button
                    onClick={() => router.push('/dashboard/internship')}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Go to Dashboard
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-white">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );

  if (!quiz) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-lg text-slate-900 font-semibold">Quiz not found</p>
        <button
          onClick={() => router.push('/career/assessment')}
          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
        >
          Back to Assessment
        </button>
      </div>
    </div>
  );

  if (flowState === "instructions") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 select-none" style={{ userSelect: "none" }}>
        <div className="max-w-3xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Top Bar with Gradient */}
          <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
            <div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wider">Instructions Page</span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Before You Begin</h1>
              <p className="text-slate-600 mt-1">Please read all instructions and security regulations carefully.</p>
            </div>
            
            {/* 10-Minute Countdown Clock */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center gap-3 shadow-lg border border-slate-800 shrink-0">
              <Clock className="h-6 w-6 text-blue-400 animate-pulse" />
              <div className="font-mono text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Quiz Auto-Starts In</p>
                <p className="text-2xl font-bold tracking-wider">{String(Math.floor(instructionTimeLeft / 60)).padStart(2, '0')}:{String(instructionTimeLeft % 60).padStart(2, '0')}</p>
              </div>
            </div>
          </div>

          {/* Guidelines Grid */}
          <div className="grid gap-6 md:grid-cols-2 mb-10">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Structure & Format
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Assessment:</strong> {quiz?.title || 'Final Assessment'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Time Limit:</strong> {quiz?.timeLimitMinutes || 60} minutes once started.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Passing Score:</strong> 60% or higher to earn a certificate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span><strong>Questions:</strong> {quiz?.QuizQuestions?.length || 0} multiple-choice questions.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Security Rules (Strict Proctoring)
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>No Tab Switching:</strong> Switching tabs or minimizing browser will trigger warnings and lead to auto-submission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Anti-Copy Controls:</strong> Right-click, Ctrl+C/X/A, and text selection are disabled.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Window Focus:</strong> Keep focus on the test window. Clicking outside the browser triggers violation warnings.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              The quiz will automatically load when the countdown reaches 00:00.
            </p>
            <button
              onClick={() => {
                setFlowState('quiz');
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Quiz Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-slate-50 select-none"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Header with timer and progress */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">{quiz.title}</h1>
            <Timer timeLeft={timeLeft} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Question {currentQuestion + 1} of {totalQuestions}</span>
            <span className="text-slate-600">{answeredCount} answered</span>
          </div>
          <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Main content */}
          <div className="lg:col-span-3">
            {currentQ && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 flex-1 pr-4">
                      {currentQ.questionText}
                    </h2>
                    <button
                      onClick={() => handleToggleFlag(currentQ.id)}
                      className={`shrink-0 p-2 rounded-lg transition-colors ${
                        flagged.has(currentQ.id)
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Flag className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600">{currentQ.marks} mark(s)</p>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {getQuestionOptions(currentQ).length > 0 ? (
                    getQuestionOptions(currentQ).map((option, idx) => {
                      const isSelected = answers[currentQ.id] === option.label;
                      return (
                        <label
                          key={option.label || idx}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${currentQ.id}`}
                            checked={isSelected}
                            onChange={() => handleSelectAnswer(currentQ.id, option.label)}
                            className="sr-only"
                          />
                          <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <span className="text-sm text-slate-600 font-medium">{option.label}.</span>
                            <span className="ml-2 text-slate-900">{option.text}</span>
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <div className="text-slate-500">No answer options available for this question.</div>
                  )}
                </div>
                {/* Navigation */}
                <div className="flex items-center gap-3 pt-8 border-t border-slate-200">
                  <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <button
                    onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
                    disabled={currentQuestion === totalQuestions - 1}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <div className="flex-1" />

                  {currentQuestion === totalQuestions - 1 && (
                    <button
                      onClick={() => setShowConfirmation(true)}
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50 transition-colors"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Question navigator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm sticky top-24">
              <h3 className="font-semibold text-slate-900 mb-4">Question Overview</h3>
              
              <div className="grid grid-cols-4 gap-2 mb-6">
                {quiz?.QuizQuestions?.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all ${
                      idx === currentQuestion
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : answers[q.id]
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={flagged.has(q.id) ? 'Flagged' : ''}
                  >
                    <div className="flex items-center justify-center h-full relative">
                      {idx + 1}
                      {flagged.has(q.id) && (
                        <Flag className="h-3 w-3 absolute top-0 right-0 text-yellow-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-100" />
                  <span className="text-slate-600">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-100" />
                  <span className="text-slate-600">Not answered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Submit Assessment?</h2>
            <p className="text-slate-600 mb-6">You have answered {answeredCount} out of {totalQuestions} questions. You cannot change your answers after submitting.</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50"
              >
                Continue
              </button>
              <button
                onClick={async () => {
                  setShowConfirmation(false);
                  await submitAnswers();
                }}
                disabled={submitting}
                className="flex-1 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security Warning Modal */}
      {showCheatingWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-slate-200 shadow-2xl text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertCircle className="h-8 w-8 text-amber-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Security Warning</h2>
            <p className="text-slate-600 mb-4 text-sm">
              Losing focus or switching tabs is not permitted during the assessment.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left text-xs space-y-2 text-slate-600">
              <p><strong>Reason:</strong> {cheatingReason}</p>
              <p><strong>Warning count:</strong> {cheatingWarnings} of {SECURITY_CONFIG.maxAllowedWarnings}</p>
            </div>
            <p className="text-xs text-red-500 mb-6 font-semibold">
              Warning: Exceeding {SECURITY_CONFIG.maxAllowedWarnings} violations will cause your assessment to be terminated and automatically submitted immediately.
            </p>
            <button
              onClick={() => setShowCheatingWarning(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              I Understand & Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
