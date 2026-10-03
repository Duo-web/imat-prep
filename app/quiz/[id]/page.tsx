import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PracticeQuizEngine from "@/components/quiz/PracticeQuizEngine";
import ExamSimulatorEngine from "@/components/quiz/ExamSimulatorEngine";
import { Section } from "@prisma/client";

export default async function QuizSessionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const quizSession = await db.session.findUnique({
    where: { id: params.id },
    include: {
      attempts: true,
      paper: true,
    },
  });

  if (!quizSession || quizSession.userId !== session.user.id) {
    redirect("/quiz");
  }

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

  if (quizSession.mode === "EXAM") {
    const durationMin = quizSession.paper?.durationMin || 100;
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
        initialTotal={quizSession.totalQuestions}
        initialCorrect={quizSession.correctCount}
        initialAnswered={quizSession.attempts.length}
      />
    </main>
  );
}
