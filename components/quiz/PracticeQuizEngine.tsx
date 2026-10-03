"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  source?: string | null;
}

interface PracticeQuizEngineProps {
  sessionId: string;
  questions: Question[];
  initialTotal: number;
  initialCorrect: number;
  initialAnswered: number;
}

export default function PracticeQuizEngine({
  sessionId,
  questions,
  initialTotal,
  initialCorrect,
  initialAnswered,
}: PracticeQuizEngineProps) {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const [stats, setStats] = useState({
    answered: initialAnswered,
    correct: initialCorrect,
    total: initialTotal || questions.length,
  });

  // Per-session timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setTimeTaken((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Questions Found</h2>
        <p className="text-gray-600 mb-6">There are no questions matching your selected filters.</p>
        <Link href="/quiz" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          Return to Quizzes
        </Link>
      </div>
    );
  }

  const currentAnswer = selectedAnswers[currentQuestion.id] || "";
  const currentResult = submittedQuestions[currentQuestion.id];
  const isCurrentFlagged = flaggedQuestions[currentQuestion.id] || false;

  const handleSelectOption = (label: string) => {
    if (currentResult) return; // Locked once submitted
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: label }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handleSubmitCurrent = async () => {
    if (!currentAnswer || isSubmitting || currentResult) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          selectedAnswer: currentAnswer,
          timeTaken: 10,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const isCorrect = data.isCorrect;
        setSubmittedQuestions((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            isCorrect,
            explanation: currentQuestion.explanation || "No explanation provided for this question.",
          },
        }));

        setStats((prev) => ({
          ...prev,
          answered: prev.answered + 1,
          correct: prev.correct + (isCorrect ? 1 : 0),
        }));
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishQuiz = async () => {
    try {
      await fetch("/api/quiz/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          timeTaken,
          answers: selectedAnswers,
        }),
      });
    } catch (e) {
      console.error("Error finishing practice session:", e);
    }
    setIsCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const options = [
    { label: "A", text: currentQuestion.optionA },
    { label: "B", text: currentQuestion.optionB },
    { label: "C", text: currentQuestion.optionC },
    { label: "D", text: currentQuestion.optionD },
    { label: "E", text: currentQuestion.optionE },
  ];

  if (isCompleted) {
    const scorePercentage = Math.round((stats.correct / (questions.length || 1)) * 100);
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            🎉
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Completed!</h1>
          <p className="text-gray-500 mb-8">Great job practicing. Here is a summary of your performance.</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Score</span>
              <span className="text-2xl font-bold text-gray-900">{scorePercentage}%</span>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <span className="block text-xs uppercase tracking-wider text-green-600 font-semibold mb-1">Correct</span>
              <span className="text-2xl font-bold text-green-700">{stats.correct} / {questions.length}</span>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <span className="block text-xs uppercase tracking-wider text-blue-600 font-semibold mb-1">Time Spent</span>
              <span className="text-2xl font-bold text-blue-700">{formatTime(timeTaken)}</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setIsCompleted(false)}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Review Questions
            </button>
            <Link
              href="/quiz"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Next Practice Set
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            Practice Mode
          </span>
          <span className="text-sm font-semibold text-gray-700">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question matrix navigation drawer pill */}
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <span>⏱️</span>
            <span className="font-mono font-bold text-gray-800">{formatTime(timeTaken)}</span>
          </div>
          <div className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 text-green-700 font-semibold">
            Score: {stats.correct} / {stats.answered}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Meta badges */}
        <div className="flex flex-wrap justify-between items-center mb-6 border-b border-gray-100 pb-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {currentQuestion.section}
            </span>
            {currentQuestion.topic && (
              <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-100">
                {currentQuestion.topic}
              </span>
            )}
            {currentQuestion.source && (
              <span className="text-xs text-gray-400 hidden sm:inline">
                • {currentQuestion.source}
              </span>
            )}
          </div>

          <button
            onClick={handleToggleFlag}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition border ${
              isCurrentFlagged
                ? "bg-amber-50 text-amber-700 border-amber-300"
                : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {isCurrentFlagged ? "📌 Flagged for review" : "🏳️ Flag question"}
          </button>
        </div>

        {/* Question Text */}
        <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {options.map((opt) => {
            const isSelected = currentAnswer === opt.label;
            const isCorrect = opt.label === currentQuestion.correctAnswer;

            let btnClass =
              "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 text-base ";

            if (currentResult) {
              if (isCorrect) {
                btnClass += "border-green-500 bg-green-50 text-green-900 font-medium";
              } else if (isSelected && !currentResult.isCorrect) {
                btnClass += "border-red-500 bg-red-50 text-red-900";
              } else {
                btnClass += "border-gray-100 text-gray-400 opacity-60";
              }
            } else {
              if (isSelected) {
                btnClass += "border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm font-medium";
              } else {
                btnClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800";
              }
            }

            return (
              <button
                key={opt.label}
                disabled={!!currentResult || isSubmitting}
                onClick={() => handleSelectOption(opt.label)}
                className={btnClass}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                    currentResult && isCorrect
                      ? "bg-green-600 text-white"
                      : currentResult && isSelected && !currentResult.isCorrect
                      ? "bg-red-600 text-white"
                      : isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {opt.label}
                </span>
                <span className="leading-snug pt-0.5">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {currentResult && (
          <div
            className={`p-6 rounded-xl border mb-6 transition-all ${
              currentResult.isCorrect
                ? "bg-green-50/80 border-green-200"
                : "bg-red-50/80 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">
                {currentResult.isCorrect ? "✅" : "❌"}
              </span>
              <h3
                className={`text-lg font-bold ${
                  currentResult.isCorrect ? "text-green-800" : "text-red-800"
                }`}
              >
                {currentResult.isCorrect ? "Correct Answer!" : "Incorrect"}
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              <span className="font-semibold text-gray-900 block mb-1">
                Explanation:
              </span>
              {currentResult.explanation}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-6 gap-4">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition"
          >
            ← Previous
          </button>

          <div className="flex items-center gap-3">
            {!currentResult ? (
              <button
                onClick={handleSubmitCurrent}
                disabled={!currentAnswer || isSubmitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg shadow-sm transition"
              >
                {isSubmitting ? "Checking..." : "Check Answer"}
              </button>
            ) : currentIndex + 1 < questions.length ? (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-sm transition"
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={handleFinishQuiz}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
              >
                Finish Practice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Question Grid Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Question Navigator
        </h4>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isSub = submittedQuestions[q.id];
            const isSelected = idx === currentIndex;
            const isFlagged = flaggedQuestions[q.id];

            let cellStyle = "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";

            if (isSub) {
              cellStyle = isSub.isCorrect
                ? "bg-green-600 text-white border-green-700"
                : "bg-red-500 text-white border-red-600";
            } else if (selectedAnswers[q.id]) {
              cellStyle = "bg-blue-100 text-blue-800 border-blue-300 font-semibold";
            }

            if (isSelected) {
              cellStyle += " ring-2 ring-blue-500 ring-offset-2";
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-9 h-9 text-xs font-medium rounded-lg border flex items-center justify-center transition ${cellStyle}`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border border-white rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
