"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizEngine({ 
  sessionId, 
  questions, 
  initialTotal, 
  initialCorrect, 
  initialAnswered 
}: {
  sessionId: string;
  questions: any[];
  initialTotal: number;
  initialCorrect: number;
  initialAnswered: number;
}) {
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean, explanation: string } | null>(null);
  
  const [stats, setStats] = useState({
    answered: initialAnswered,
    correct: initialCorrect,
    total: initialTotal
  });

  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    // simple per-question timer
    const timer = setInterval(() => {
      if (!result) setTimeTaken(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [result, currentIndex]);

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) return null;

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          selectedAnswer,
          timeTaken
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult({
          isCorrect: data.isCorrect,
          explanation: currentQuestion.explanation || "No explanation provided."
        });
        
        setStats(prev => ({
          ...prev,
          answered: prev.answered + 1,
          correct: prev.correct + (data.isCorrect ? 1 : 0)
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setResult(null);
    setSelectedAnswer(null);
    setTimeTaken(0);
    
    if (currentIndex + 1 >= questions.length) {
      // Finished
      router.refresh();
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const options = [
    { label: "A", text: currentQuestion.optionA },
    { label: "B", text: currentQuestion.optionB },
    { label: "C", text: currentQuestion.optionC },
    { label: "D", text: currentQuestion.optionD },
    { label: "E", text: currentQuestion.optionE },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {currentQuestion.section}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md font-medium">
            Question {stats.answered + 1} of {stats.total}
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <span>⏱️</span>
            <span className="w-12">{formatTime(timeTaken)}</span>
          </div>
          <div>
            Score: <span className="text-green-600 font-bold">{stats.correct}</span> / {stats.answered}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <h2 className="text-xl font-medium text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-3">
          {options.map((opt) => {
            const isSelected = selectedAnswer === opt.label;
            
            let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 ";
            
            if (result) {
              if (opt.label === currentQuestion.correctAnswer) {
                btnClass += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected && !result.isCorrect) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-gray-200 opacity-50";
              }
            } else {
              if (isSelected) {
                btnClass += "border-blue-500 bg-blue-50 text-blue-900 shadow-sm";
              } else {
                btnClass += "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700";
              }
            }

            return (
              <button
                key={opt.label}
                disabled={!!result || isSubmitting}
                onClick={() => setSelectedAnswer(opt.label)}
                className={btnClass}
              >
                <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-sm font-bold
                  ${result && opt.label === currentQuestion.correctAnswer ? 'bg-green-200 text-green-800' : 
                    (result && isSelected && !result.isCorrect ? 'bg-red-200 text-red-800' : 
                    (isSelected ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-500'))}
                `}>
                  {opt.label}
                </span>
                <span className="leading-snug pt-0.5">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result / Explanation */}
      {result && (
        <div className={`p-6 rounded-xl border mb-6 ${result.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`text-lg font-bold mb-2 ${result.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            <span className="font-semibold mr-2">Explanation:</span>
            {result.explanation}
          </p>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex justify-end">
        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-sm transition-all"
          >
            {isSubmitting ? 'Submitting...' : 'Check Answer'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-xl shadow-sm transition-all"
          >
            {currentIndex + 1 >= questions.length ? 'Finish Quiz' : 'Next Question ➔'}
          </button>
        )}
      </div>
    </div>
  );
}
