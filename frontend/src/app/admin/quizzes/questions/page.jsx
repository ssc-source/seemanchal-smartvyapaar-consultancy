"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import { adminApi } from "@/lib/adminApi";

export default function QuestionBankPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getQuizzes();
      const data = Array.isArray(res) ? res : res.data || [];
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadQuizzes = async () => {
      await fetchQuizzes();
    };

    loadQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await adminApi.deleteQuiz(id);
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  if (isLoading) {
    return <div className="text-slate-600">Loading question bank...</div>;
  }

  const filtered = quizzes.filter((quiz) =>
    quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-600 mt-2">Manage quiz questions and assessments</p>
        </div>
        <Link href="/admin/quizzes/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            New Quiz
          </button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Questions</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                  No quizzes found
                </td>
              </tr>
            ) : (
              filtered.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{quiz.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {quiz.questionCount || 0} questions
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{quiz.duration} mins</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/quizzes?quizId=${quiz.id}`}>
                        <button className="p-1 hover:bg-slate-100 rounded">
                          <Eye size={18} className="text-slate-600" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
