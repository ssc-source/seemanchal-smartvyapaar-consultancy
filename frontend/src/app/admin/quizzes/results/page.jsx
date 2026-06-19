"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Loader2, CheckCircle2, XCircle, BarChart3, TrendingUp, Users } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function ResultsPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState("ALL");

  const fetchQuizzes = async () => {
    try {
      setQuizzesLoading(true);
      const res = await adminApi.getQuizzes();
      const data = res.data || res || [];
      setQuizzes(data);
      if (data.length > 0) {
        setSelectedQuizId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setQuizzesLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (!active) return;
      fetchQuizzes();
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedQuizId) return;
    const fetchAttempts = async () => {
      try {
        setAttemptsLoading(true);
        const res = await adminApi.getQuizAttempts(selectedQuizId);
        setAttempts(res.data || res || []);
      } catch (error) {
        console.error("Error fetching attempts:", error);
        setAttempts([]);
      } finally {
        setAttemptsLoading(false);
      }
    };
    fetchAttempts();
  }, [selectedQuizId]);

  const stats = useMemo(() => {
    if (attempts.length === 0) return { total: 0, passed: 0, failed: 0, passRate: 0, avgScore: 0 };
    const total = attempts.length;
    const passed = attempts.filter((a) => a.passed).length;
    const failed = total - passed;
    const passRate = Math.round((passed / total) * 100);
    const sumScore = attempts.reduce((sum, a) => sum + (Number(a.score) || 0), 0);
    const avgScore = Math.round(sumScore / total);
    return { total, passed, failed, passRate, avgScore };
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    return attempts.filter((attempt) => {
      const student = attempt.QuizRegistration?.StudentProfile;
      if (filterResult === "PASS" && !attempt.passed) return false;
      if (filterResult === "FAIL" && attempt.passed) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          student?.name?.toLowerCase().includes(q) ||
          student?.email?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [attempts, searchTerm, filterResult]);

  if (quizzesLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Assessment Results</h1>
          <p className="text-slate-600 mt-2">Analyze student performance and pass metrics</p>
        </div>
        <div>
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700 min-w-[200px]"
          >
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Attempts</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Passed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.passed}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <XCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Failed</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.failed}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Average Score / Pass Rate</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Score: {stats.avgScore} • {stats.passRate}% Pass
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <select
          value={filterResult}
          onChange={(e) => setFilterResult(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-700"
        >
          <option value="ALL">All Results</option>
          <option value="PASS">Passed</option>
          <option value="FAIL">Failed</option>
        </select>
      </div>

      {/* Detailed Attempts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {attemptsLoading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading attempts...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Result</th>
                <th className="px-6 py-4">Date Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredAttempts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    No attempts found for this quiz
                  </td>
                </tr>
              ) : (
                filteredAttempts.map((attempt) => {
                  const student = attempt.QuizRegistration?.StudentProfile;
                  return (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{student?.name || '—'}</p>
                        <p className="text-xs text-slate-500">{student?.email || '—'}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-bold font-mono">
                        {attempt.score ?? 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          attempt.passed ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(attempt.completedAt || attempt.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
