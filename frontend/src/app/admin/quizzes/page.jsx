"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { Plus, Edit2, Trash2, BookOpen, Award, ListChecks, BarChart3 } from "lucide-react";

const quizStatusOptions = ["draft", "published", "archived"];
const optionKeys = ["A", "B", "C", "D"];

export function AdminQuizzesContent() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    timeLimitMinutes: 30,
    passMarks: 50,
    status: "draft",
  });
  const [questionForm, setQuestionForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
  });
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const res = await adminApi.getQuizzes();
      setQuizzes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuizDetails = async (quizId) => {
    if (!quizId) return;
    try {
      const quizResult = await adminApi.getQuiz(quizId);
      setSelectedQuiz(quizResult.data);
      const questionResult = await adminApi.getQuizQuestions(quizId);
      setQuestions(questionResult.data || []);
      const attemptsResult = await adminApi.getQuizAttempts(quizId);
      setAttempts(attemptsResult.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizForm({
      title: quiz.title || "",
      description: quiz.description || "",
      timeLimitMinutes: quiz.timeLimitMinutes || 30,
      passMarks: quiz.passMarks || 50,
      status: quiz.status || "draft",
    });
  };

  const searchParams = useSearchParams();
  const quizIdParam = searchParams.get("quizId");

  useEffect(() => {
    const loadQuizzes = async () => {
      await fetchQuizzes();
    };

    loadQuizzes();
  }, []);

  useEffect(() => {
    if (quizIdParam && quizzes.length > 0) {
      const found = quizzes.find(q => q.id === quizIdParam);
      if (found) {
        const timer = setTimeout(() => {
          handleSelectQuiz(found);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [quizIdParam, quizzes]);

  useEffect(() => {
    if (selectedQuiz?.id) {
      const loadQuizDetails = async () => {
        await fetchQuizDetails(selectedQuiz.id);
      };

      loadQuizDetails();
    }
  }, [selectedQuiz?.id]);

  const resetQuizForm = () => {
    setSelectedQuiz(null);
    setQuizForm({ title: "", description: "", timeLimitMinutes: 30, passMarks: 50, status: "draft" });
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      alert("Quiz title is required.");
      return;
    }
    try {
      if (selectedQuiz?.id) {
        await adminApi.updateQuiz(selectedQuiz.id, quizForm);
      } else {
        const res = await adminApi.createQuiz(quizForm);
        setSelectedQuiz(res.data);
      }
      fetchQuizzes();
      if (selectedQuiz?.id) fetchQuizDetails(selectedQuiz.id);
    } catch (err) {
      alert(err.message || "Failed to save quiz.");
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await adminApi.deleteQuiz(id);
      resetQuizForm();
      fetchQuizzes();
    } catch (err) {
      alert(err.message || "Failed to delete quiz.");
    }
  };

  const resetQuestionForm = () => {
    setEditingQuestionId(null);
    setQuestionForm({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", marks: 1 });
  };

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id);
    setQuestionForm({
      question: question.question || "",
      optionA: question.optionA || "",
      optionB: question.optionB || "",
      optionC: question.optionC || "",
      optionD: question.optionD || "",
      correctAnswer: question.correctAnswer || "A",
      marks: question.marks || 1,
    });
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!selectedQuiz?.id) {
      alert("Select or create a quiz before adding questions.");
      return;
    }
    if (!questionForm.question.trim()) {
      alert("Question text is required.");
      return;
    }

    try {
      if (editingQuestionId) {
        await adminApi.updateQuizQuestion(editingQuestionId, questionForm);
      } else {
        await adminApi.createQuizQuestion(selectedQuiz.id, questionForm);
      }
      resetQuestionForm();
      fetchQuizDetails(selectedQuiz.id);
    } catch (err) {
      alert(err.message || "Failed to save question.");
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await adminApi.deleteQuizQuestion(id);
      resetQuestionForm();
      if (selectedQuiz?.id) fetchQuizDetails(selectedQuiz.id);
    } catch (err) {
      alert(err.message || "Failed to delete question.");
    }
  };

  const leaderboard = useMemo(() => {
    return [...attempts]
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 8);
  }, [attempts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-800">Quizzes</h3>
              <p className="text-sm text-slate-500">Manage exams and question banks.</p>
            </div>
            <button onClick={resetQuizForm} className="flex items-center gap-2 bg-brand-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-slate-800 transition-colors">
              <Plus className="h-4 w-4" /> New
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400">Loading quizzes…</div>
            ) : (
              <div className="divide-y divide-slate-200">
                {quizzes.map((quiz) => (
                  <button key={quiz.id} onClick={() => handleSelectQuiz(quiz)} className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${selectedQuiz?.id === quiz.id ? 'bg-slate-100' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-medium text-slate-900">{quiz.title}</h4>
                        <p className="text-sm text-slate-500 truncate">{quiz.description}</p>
                      </div>
                      <span className="text-xs uppercase text-slate-600">{quiz.status}</span>
                    </div>
                  </button>
                ))}
                {quizzes.length === 0 && <div className="p-8 text-slate-500">No quizzes yet.</div>}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">{selectedQuiz ? 'Edit Quiz' : 'New Quiz'}</h3>
                <p className="text-sm text-slate-500">Create or update exam settings.</p>
              </div>
              {selectedQuiz && (
                <button onClick={() => handleDeleteQuiz(selectedQuiz.id)} className="text-red-600 hover:text-red-800 text-sm">Delete Quiz</button>
              )}
            </div>
            <form onSubmit={handleSaveQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={quizForm.description} onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                  <input type="number" min={1} value={quizForm.timeLimitMinutes} onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) || 1 })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pass Marks (%)</label>
                  <input type="number" min={0} max={100} value={quizForm.passMarks} onChange={(e) => setQuizForm({ ...quizForm, passMarks: Number(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={quizForm.status} onChange={(e) => setQuizForm({ ...quizForm, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                    {quizStatusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-brand-primary text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">Save Quiz</button>
                {selectedQuiz && <button type="button" onClick={resetQuizForm} className="bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200">New Quiz</button>}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">Question Bank</h3>
                <p className="text-sm text-slate-500">Add or edit questions for the selected quiz.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                <ListChecks className="h-4 w-4" /> {questions.length} questions
              </span>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                  <textarea value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Option A</label>
                    <input value={questionForm.optionA} onChange={(e) => setQuestionForm({ ...questionForm, optionA: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Option B</label>
                    <input value={questionForm.optionB} onChange={(e) => setQuestionForm({ ...questionForm, optionB: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Option C</label>
                    <input value={questionForm.optionC} onChange={(e) => setQuestionForm({ ...questionForm, optionC: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Option D</label>
                    <input value={questionForm.optionD} onChange={(e) => setQuestionForm({ ...questionForm, optionD: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Correct Answer</label>
                    <select value={questionForm.correctAnswer} onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
                      {optionKeys.map((key) => <option key={key} value={key}>{key}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Marks</label>
                    <input type="number" min={1} value={questionForm.marks} onChange={(e) => setQuestionForm({ ...questionForm, marks: Number(e.target.value) || 1 })} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="mt-2 bg-brand-primary text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors">{editingQuestionId ? 'Update' : 'Add'} Question</button>
                    {(editingQuestionId || questions.length > 0) && <button type="button" onClick={resetQuestionForm} className="mt-2 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200">Reset</button>}
                  </div>
                </div>
              </form>
              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                {questions.length === 0 ? (
                  <div className="text-slate-500 text-sm">Select a quiz to view questions.</div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((question) => (
                      <div key={question.id} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-slate-900">{question.question}</h4>
                            <p className="text-xs text-slate-500 mt-1">Marks: {question.marks} • Correct: {question.correctAnswer}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => handleEditQuestion(question)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteQuestion(question.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-800">Leaderboard</h3>
                <p className="text-sm text-slate-500">Top attempts for the selected quiz.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-sm text-slate-500"><BarChart3 className="h-4 w-4" /> {leaderboard.length}</span>
            </div>
            {leaderboard.length === 0 ? (
              <div className="text-slate-500">No attempts yet.</div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((attempt) => (
                  <div key={attempt.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{attempt.QuizRegistration?.StudentProfile?.name || 'Student'}</p>
                        <p className="text-xs text-slate-500">Score: {attempt.score ?? 0}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${attempt.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{attempt.passed ? 'Passed' : 'Failed'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminQuizzes() {
  return (
    <Suspense fallback={<div className="text-slate-600">Loading quiz editor...</div>}>
      <AdminQuizzesContent />
    </Suspense>
  );
}
