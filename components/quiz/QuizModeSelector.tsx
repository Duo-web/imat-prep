"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Paper {
  id: string;
  year: number;
  title: string;
  isFree: boolean;
  totalMarks: number;
  durationMin: number;
  _count: { questions: number };
}

interface QuizModeSelectorProps {
  papers: Paper[];
}

export default function QuizModeSelector({ papers }: QuizModeSelectorProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"practice" | "exam">("practice");

  // Practice state
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedLimit, setSelectedLimit] = useState("10");
  const [selectedPracticePaper, setSelectedPracticePaper] = useState("");
  const [isStartingPractice, setIsStartingPractice] = useState(false);

  // Exam state
  const [selectedExamPaper, setSelectedExamPaper] = useState(papers[0]?.id || "");
  const [isStartingExam, setIsStartingExam] = useState(false);

  const sections = [
    { id: "ALL", label: "All Sections", icon: "📚" },
    { id: "BIOLOGY", label: "Biology", icon: "🧬" },
    { id: "CHEMISTRY", label: "Chemistry", icon: "🧪" },
    { id: "PHYSICS", label: "Physics", icon: "⚡" },
    { id: "MATHS", label: "Mathematics", icon: "📐" },
    { id: "LOGICAL", label: "Logical Reasoning", icon: "🧠" },
    { id: "READING", label: "Reading Comprehension", icon: "📖" },
  ];

  const questionLimits = ["5", "10", "20", "50"];

  const handleStartPractice = async () => {
    setIsStartingPractice(true);
    try {
      const res = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "PRACTICE",
          section: selectedSection,
          limit: selectedLimit,
          paperId: selectedPracticePaper || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsStartingPractice(false);
    }
  };

  const handleStartExam = async () => {
    setIsStartingExam(true);
    try {
      const res = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "EXAM",
          paperId: selectedExamPaper || undefined,
          limit: 60,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(data.url);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsStartingExam(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="bg-gray-200/80 p-1.5 rounded-2xl flex gap-1 border border-gray-300/50 max-w-md w-full">
          <button
            onClick={() => setActiveTab("practice")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "practice"
                ? "bg-white text-blue-600 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>🎯</span>
            <span>Practice Mode</span>
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "exam"
                ? "bg-slate-900 text-amber-400 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>⏱️</span>
            <span>Exam Simulator</span>
          </button>
        </div>
      </div>

      {/* PRACTICE MODE CARD */}
      {activeTab === "practice" && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-10 max-w-3xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Customized Question Practice
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-3">Practice Engine</h2>
            <p className="text-gray-500 text-sm mt-1">
              Select specific subject sections, paper sources, and question counts for instant feedback and detailed explanations.
            </p>
          </div>

          {/* Section Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              1. Choose Subject / Section
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={`p-3 rounded-xl border text-left text-sm font-medium transition flex items-center gap-2.5 ${
                    selectedSection === sec.id
                      ? "border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-sm"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50/50"
                  }`}
                >
                  <span className="text-lg">{sec.icon}</span>
                  <span className="truncate">{sec.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question Limit */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              2. Question Set Size
            </label>
            <div className="flex gap-3">
              {questionLimits.map((limit) => (
                <button
                  key={limit}
                  onClick={() => setSelectedLimit(limit)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-bold transition ${
                    selectedLimit === limit
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                  }`}
                >
                  {limit} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Paper Source Optional Dropdown */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              3. Paper Filter (Optional)
            </label>
            <select
              value={selectedPracticePaper}
              onChange={(e) => setSelectedPracticePaper(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Available Question Sources (Mixed)</option>
              {papers.map((p) => (
                <option key={p.id} value={p.id}>
                  IMAT {p.year} Official Past Paper ({p._count.questions} questions available)
                </option>
              ))}
            </select>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartPractice}
            disabled={isStartingPractice}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-lg transition"
          >
            {isStartingPractice ? "Preparing Practice Set..." : "Start Practice Session 🚀"}
          </button>
        </div>
      )}

      {/* EXAM SIMULATOR CARD */}
      {activeTab === "exam" && (
        <div className="bg-slate-900 text-white rounded-3xl shadow-xl border border-slate-800 p-6 md:p-10 max-w-3xl mx-auto space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Official Exam Simulation
            </span>
            <h2 className="text-2xl font-bold mt-3">IMAT Full Exam Simulator</h2>
            <p className="text-slate-400 text-sm mt-1">
              Simulate real IMAT exam conditions with a 100-minute countdown timer, official section distribution, and real score calculation.
            </p>
          </div>

          {/* Rules Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700 text-center">
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Duration</span>
              <span className="text-xl font-bold text-amber-400">100 Minutes</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">Questions</span>
              <span className="text-xl font-bold text-white">60 MCQs</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-slate-400 uppercase">IMAT Scoring</span>
              <span className="text-xl font-bold text-emerald-400">+1.5 / -0.4</span>
            </div>
          </div>

          {/* Select Paper */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Past Paper Exam Simulation
            </label>
            <div className="space-y-3">
              {papers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedExamPaper(p.id)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex justify-between items-center ${
                    selectedExamPaper === p.id
                      ? "border-amber-400 bg-slate-800 text-white shadow-lg ring-1 ring-amber-400"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-base text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      60 questions across all 4 official sections • {p.durationMin} mins
                    </p>
                  </div>
                  <span className="text-xs font-semibold bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-slate-700">
                    {p._count.questions} Qs
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Start Exam Simulation */}
          <button
            onClick={handleStartExam}
            disabled={isStartingExam}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-base rounded-2xl shadow-xl transition"
          >
            {isStartingExam ? "Starting Simulation..." : "Begin IMAT Exam Simulation ⏱️"}
          </button>
        </div>
      )}
    </div>
  );
}
