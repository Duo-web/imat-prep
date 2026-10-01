import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function QuizSetupPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // Find all papers that have questions
  const papers = await db.paper.findMany({
    where: {
      questions: {
        some: {}
      }
    },
    include: {
      _count: {
        select: { questions: true }
      }
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Quizzes</h1>
        <p className="text-gray-600 mb-8">Select a paper to start practicing its questions.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map(paper => (
            <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{paper.title}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {paper._count.questions} Qs
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6 flex-grow">
                Test yourself against the official IMAT {paper.year} questions.
              </p>
              <form action={`/api/quiz/start`} method="POST">
                <input type="hidden" name="paperId" value={paper.id} />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Start Practice
                </button>
              </form>
            </div>
          ))}

          {/* Random Practice Block */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Random Practice</h2>
              <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Mixed
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6 flex-grow">
              Get a set of 10 random questions across all topics to test your overall knowledge.
            </p>
            <form action={`/api/quiz/start`} method="POST">
                <input type="hidden" name="mode" value="random" />
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Start Random Quiz
                </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
