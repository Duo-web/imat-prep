"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Question {
  id: string;
  section: string;
  topic?: string | null;
  difficulty?: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE: string;
  correctAnswer: string;
  explanation?: string | null;
}

interface ExamSimulatorEngineProps {
  sessionId: string;
  questions: Question[];
  durationMinutes?: number;
}

export default function ExamSimulatorEngine({
  sessionId,
  questions,
  durationMinutes = 100,
}: ExamSimulatorEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);

  // Results state
  const [results, setResults] = useState<{
    score: number;
    maxScore: number;
    correctCount: number;
    wrongCount: number;
    blankCount: number;
    timeTaken: number;
    userAnswers: Record<string, { selected: string; isCorrect: boolean; correct: string }>;
  } | null>(null);

  // Global Countdown Timer
  useEffect(() => {
    if (results) return; // Stop timer on completion

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [results]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (label: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: prev[currentQuestion.id] === label ? "" : label, // Toggle select/unselect
    }));
  };

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const timeTaken = durationMinutes * 60 - timeLeft;
      const res = await fetch("/api/quiz/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          timeTaken,
          answers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults({
          score: data.score,
          maxScore: data.maxScore || questions.length * 1.5,
          correctCount: data.correctCount,
          wrongCount: data.wrongCount,
          blankCount: data.blankCount,
          timeTaken,
          userAnswers: data.userAnswers,
        });
        setShowSubmitModal(false);
      }
    } catch (e) {
      console.error("Exam submit error:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!currentQuestion && !results) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Exam Questions Loaded</h2>
        <p className="text-gray-600 mb-6">Unable to load the simulation exam set.</p>
        <Link href="/quiz" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          Return to Quizzes
        </Link>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // POST-EXAM RESULTS SCORECARD
  // ─────────────────────────────────────────
  if (results) {
    // Group section results
    const sectionStats: Record<string, { total: number; correct: number; wrong: number; blank: number; mark: number }> = {};

    questions.forEach((q) => {
      const sec = q.section;
      if (!sectionStats[sec]) {
        sectionStats[sec] = { total: 0, correct: 0, wrong: 0, blank: 0, mark: 0 };
      }
      sectionStats[sec].total++;

      const ans = results.userAnswers[q.id];
      if (!ans || !ans.selected) {
        sectionStats[sec].blank++;
      } else if (ans.isCorrect) {
        sectionStats[sec].correct++;
        sectionStats[sec].mark += 1.5;
      } else {
        sectionStats[sec].wrong++;
        sectionStats[sec].mark -= 0.4;
      }
    });

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
        {/* Main Score Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-indigo-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-wider">
                Official IMAT Exam Simulation Report
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold mt-3">
                IMAT Score: <span className="text-amber-400">{results.score}</span> / {results.maxScore}
              </h1>
              <p className="text-blue-200 mt-2 text-sm max-w-lg">
                Calculated using official IMAT scoring rules: +1.5 for correct answers, -0.4 penalty for incorrect answers, and 0 for unanswered.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 min-w-[200px]">
              <div className="text-xs uppercase tracking-wider text-gray-300 mb-1">Duration</div>
              <div className="text-2xl font-mono font-bold">{formatTimer(results.timeTaken)}</div>
              <div className="text-xs text-blue-300 mt-2">
                {results.correctCount} Correct • {results.wrongCount} Wrong • {results.blankCount} Blank
              </div>
            </div>
          </div>
        </div>

        {/* Section Breakdown Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📊 Section Performance Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4 text-center">Questions</th>
                  <th className="py-3 px-4 text-center">Correct (+1.5)</th>
                  <th className="py-3 px-4 text-center">Wrong (-0.4)</th>
                  <th className="py-3 px-4 text-center">Blank (0)</th>
                  <th className="py-3 px-4 text-right">Section Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {Object.entries(sectionStats).map(([sec, stat]) => (
                  <tr key={sec} className="hover:bg-gray-50/50">
                    <td className="py-4 px-4 font-semibold text-gray-900">{sec}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{stat.total}</td>
                    <td className="py-4 px-4 text-center text-green-600 font-bold">+{stat.correct}</td>
                    <td className="py-4 px-4 text-center text-red-500 font-bold">-{stat.wrong}</td>
                    <td className="py-4 px-4 text-center text-gray-400">{stat.blank}</td>
                    <td className="py-4 px-4 text-right font-bold text-gray-900">
                      {stat.mark.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Question Review */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📝 Question Review & Explanations
          </h2>

          {questions.map((q, idx) => {
            const userAns = results.userAnswers[q.id];
            const selected = userAns?.selected || "";
            const isCorrect = userAns?.isCorrect || false;
            const isBlank = !selected;

            const opts = [
              { label: "A", text: q.optionA },
              { label: "B", text: q.optionB },
              { label: "C", text: q.optionC },
              { label: "D", text: q.optionD },
              { label: "E", text: q.optionE },
            ];

            return (
              <div
                key={q.id}
                className={`p-6 rounded-xl border transition-all ${
                  isCorrect
                    ? "border-green-200 bg-green-50/20"
                    : isBlank
                    ? "border-gray-200 bg-gray-50/30"
                    : "border-red-200 bg-red-50/20"
                }`}
              >
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">
                      Q{idx + 1}.
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded font-medium">
                      {q.section}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : isBlank
                        ? "bg-gray-200 text-gray-600"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isCorrect ? "✅ +1.5 pts" : isBlank ? "⚪ 0.0 pts (Unanswered)" : "❌ -0.4 pts"}
                  </span>
                </div>

                <p className="text-gray-900 font-medium mb-4">{q.questionText}</p>

                <div className="grid grid-cols-1 gap-2 mb-4">
                  {opts.map((opt) => {
                    const isChoice = selected === opt.label;
                    const isRightChoice = q.correctAnswer === opt.label;

                    let rowClass = "p-3 rounded-lg border text-sm flex items-start gap-3 ";
                    if (isRightChoice) {
                      rowClass += "border-green-500 bg-green-100/70 font-semibold text-green-900";
                    } else if (isChoice && !isCorrect) {
                      rowClass += "border-red-500 bg-red-100/70 font-semibold text-red-900";
                    } else {
                      rowClass += "border-gray-200 text-gray-600 opacity-60";
                    }

                    return (
                      <div key={opt.label} className={rowClass}>
                        <span className="w-5 h-5 flex items-center justify-center font-bold text-xs rounded bg-white/80">
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200 text-xs text-gray-700 leading-relaxed">
                    <span className="font-bold text-gray-900 block mb-1">Explanation:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link
            href="/quiz"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            Back to Quiz Hub
          </Link>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // EXAM SIMULATOR ACTIVE TEST VIEW
  // ─────────────────────────────────────────
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const isTimeWarning = timeLeft < 600; // less than 10 minutes

  const options = [
    { label: "A", text: currentQuestion.optionA },
    { label: "B", text: currentQuestion.optionB },
    { label: "C", text: currentQuestion.optionC },
    { label: "D", text: currentQuestion.optionD },
    { label: "E", text: currentQuestion.optionE },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Sticky Exam Bar */}
      <div className="sticky top-4 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
            LIVE SIMULATION
          </span>
          <span className="text-sm text-gray-300 font-medium hidden sm:inline">
            IMAT Official Exam
          </span>
        </div>

        {/* Global Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-lg font-bold transition-all ${
            isTimeWarning
              ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse"
              : "bg-slate-800 text-emerald-400 border-slate-700"
          }`}
        >
          <span>⏱️</span>
          <span>{formatTimer(timeLeft)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNavigator(!showNavigator)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            Questions Grid ({answeredCount}/{questions.length})
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow-md"
          >
            End & Submit Exam
          </button>
        </div>
      </div>

      {/* Main Question Interface */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
              {currentQuestion.section}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {answers[currentQuestion.id] && (
              <button
                onClick={handleClearAnswer}
                className="text-xs text-red-600 hover:underline font-medium"
              >
                Clear choice
              </button>
            )}
            <button
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
                flagged[currentQuestion.id]
                  ? "bg-amber-50 text-amber-700 border-amber-300"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {flagged[currentQuestion.id] ? "📌 Flagged" : "🏳️ Flag for Review"}
            </button>
          </div>
        </div>

        {/* Question Prompt */}
        <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {options.map((opt) => {
            const isSelected = answers[currentQuestion.id] === opt.label;

            return (
              <button
                key={opt.label}
                onClick={() => handleSelectOption(opt.label)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 text-base ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 font-medium shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="leading-snug pt-0.5">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-6">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition"
          >
            ← Previous Question
          </button>

          <span className="text-xs text-gray-400 font-medium">
            {answeredCount} of {questions.length} answered
          </span>

          <button
            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm disabled:opacity-40 transition"
          >
            Next Question →
          </button>
        </div>
      </div>

      {/* Question Matrix Drawer / Overlay */}
      {showNavigator && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
              Exam Question Navigator
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-600 rounded"></span> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-100 border rounded"></span> Unanswered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-amber-400 rounded"></span> Flagged
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
            {questions.map((q, idx) => {
              const isAns = !!answers[q.id];
              const isFlag = !!flagged[q.id];
              const isCurrent = idx === currentIndex;

              let btnClass = "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
              if (isAns) btnClass = "bg-blue-600 text-white border-blue-700 font-bold";

              if (isCurrent) btnClass += " ring-2 ring-indigo-500 ring-offset-2";

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowNavigator(false);
                  }}
                  className={`relative h-10 text-xs font-semibold rounded-lg border flex items-center justify-center transition ${btnClass}`}
                >
                  {idx + 1}
                  {isFlag && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border border-white rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-100 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">
              📝
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Submit Exam?</h3>
              <p className="text-gray-500 text-sm mt-1">
                Are you ready to submit your exam and generate your official score report?
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm text-left border border-gray-100">
              <div className="flex justify-between text-gray-700">
                <span>Answered Questions:</span>
                <span className="font-bold text-blue-600">{answeredCount} / {questions.length}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Unanswered Questions:</span>
                <span className="font-bold text-gray-500">{questions.length - answeredCount}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Flagged Questions:</span>
                <span className="font-bold text-amber-600">{flaggedCount}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Remaining Time:</span>
                <span className="font-bold font-mono text-gray-900">{formatTimer(timeLeft)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition text-sm"
              >
                Return to Exam
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition text-sm shadow-md"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
