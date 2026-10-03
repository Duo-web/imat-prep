import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuizModeSelector from "@/components/quiz/QuizModeSelector";

export default async function QuizSetupPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Find all papers that have questions
  const papers = await db.paper.findMany({
    where: {
      questions: {
        some: {},
      },
    },
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { year: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            🎓 IMAT Quiz & Exam Hub
          </h1>
          <p className="text-gray-500 mt-2 text-base md:text-lg">
            Practice section-by-section with instant explanations, or launch a full 100-minute timed exam simulator.
          </p>
        </div>

        {/* Mode Selector Component */}
        <QuizModeSelector papers={papers} />
      </div>
    </main>
  );
}
