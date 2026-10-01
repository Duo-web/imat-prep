import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuizEngine from "@/components/quiz/QuizEngine";

export default async function QuizSessionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const quizSession = await db.session.findUnique({
    where: { id: params.id },
    include: {
      attempts: true // Get any previous attempts if they resumed
    }
  });

  if (!quizSession || quizSession.userId !== session.user.id) {
    redirect("/quiz");
  }

  let questions = [];

  if (quizSession.paperId) {
    questions = await db.question.findMany({
      where: { paperId: quizSession.paperId },
      orderBy: { id: 'asc' }
    });
  } else {
    // Random practice: fetch 10 random questions. 
    // PostgreSQL doesn't have a simple random via prisma cleanly, so we fetch all and slice or use raw query.
    // Since this is a simple implementation for Day 5, we just take 10.
    questions = await db.question.findMany({
      take: quizSession.totalQuestions,
    });
  }

  // Find which questions are already answered
  const answeredQuestionIds = quizSession.attempts.map(a => a.questionId);
  const remainingQuestions = questions.filter(q => !answeredQuestionIds.includes(q.id));

  if (remainingQuestions.length === 0 || quizSession.completed) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
          <p className="text-gray-600 mb-6">You scored {quizSession.correctCount} out of {quizSession.totalQuestions}.</p>
          <a href="/quiz" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block">
            Back to Quizzes
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <QuizEngine 
        sessionId={quizSession.id} 
        questions={remainingQuestions} 
        initialTotal={quizSession.totalQuestions}
        initialCorrect={quizSession.correctCount}
        initialAnswered={quizSession.attempts.length}
      />
    </main>
  );
}
