import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PracticeQuizEngine from "@/components/quiz/PracticeQuizEngine";
import ExamSimulatorEngine from "@/components/quiz/ExamSimulatorEngine";
import { Section } from "@prisma/client";

export default async function QuizSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // ── Load session ────────────────────────────────────────────────────────────
  const quizSession = await db.session.findUnique({
    where: { id: params.id },
    include: {
      attempts: true,
      paper: true,
    },
  });

  if (!quizSession || quizSession.userId !== session.user.id) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Session Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            This quiz session doesn&apos;t exist or you don&apos;t have
            permission to access it.
          </p>
          <Link
            href="/quiz"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Start a New Quiz
          </Link>
        </div>
      </main>
    );
  }

  // ── Fetch questions with the same filters the session was created with ───────
  const whereClause: any = { isActive: true };

  if (quizSession.paperId) {
    whereClause.paperId = quizSession.paperId;
  } else if (quizSession.sectionFilter) {
    whereClause.section = quizSession.sectionFilter as Section;
  }

  const questions = await db.question.findMany({
    where: whereClause,
    take: quizSession.totalQuestions,
    orderBy: { id: "asc" },
  });

  // Guard: if DB returned fewer questions than expected (e.g. questions were
  // soft-deleted between session creation and now), show a meaningful error
  // rather than letting the quiz engine silently misbehave.
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Questions Available
          </h1>
          <p className="text-gray-500 mb-6">
            The questions for this session are no longer available. Please
            start a new quiz.
          </p>
          <Link
            href="/quiz"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Back to Quizzes
          </Link>
        </div>
      </main>
    );
  }

  // Sync totalQuestions with the actual count returned (handles edge case
  // where DB had fewer questions at fetch time than at session creation time).
  const actualTotal = questions.length;
  if (actualTotal !== quizSession.totalQuestions) {
    await db.session.update({
      where: { id: quizSession.id },
      data: { totalQuestions: actualTotal },
    });
  }

  // ── Render the appropriate engine ────────────────────────────────────────────
  if (quizSession.mode === "EXAM") {
    const durationMin = quizSession.paper?.durationMin ?? 100;
    return (
      <main className="min-h-screen bg-slate-950 p-4 md:p-8">
        <ExamSimulatorEngine
          sessionId={quizSession.id}
          questions={questions}
          durationMinutes={durationMin}
        />
      </main>
    );
  }

  // PRACTICE Mode
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <PracticeQuizEngine
        sessionId={quizSession.id}
        questions={questions}
        initialTotal={actualTotal}
        initialCorrect={quizSession.correctCount}
        initialAnswered={quizSession.attempts.length}
      />
    </main>
  );
}
