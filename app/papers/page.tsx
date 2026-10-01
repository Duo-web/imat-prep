import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function PapersPage() {
  const session = await getServerSession(authOptions);
  // User is premium if they are logged in and not on the FREE tier
  const isPremium = session?.user?.subscriptionStatus && session.user.subscriptionStatus !== "FREE";

  const dbPapers = await db.paper.findMany({
    orderBy: { year: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          📄 IMAT Past Papers
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Download available IMAT past papers. Practice with real exam questions from 2015 to 2025.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full border border-green-200">
          ✅ {dbPapers.length} papers available
        </div>
      </section>

      {/* Papers Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Available Papers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {dbPapers.map((paper) => (
            <PaperCard 
              key={paper.year} 
              year={paper.year} 
              isFree={paper.isFree}
              hasAccess={paper.isFree || isPremium}
            />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      {!isPremium && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              Want access to locked papers?
            </h2>
            <p className="text-blue-100 mb-6">
              Get unlimited practice questions, full exam simulators, and
              performance analytics — starting at just €12/month.
            </p>
            <Link
              href="/dashboard/pricing"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Upgrade Now
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

function PaperCard({ year, isFree, hasAccess }: { year: number, isFree: boolean, hasAccess: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Year badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-gray-900">{year}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isFree ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {isFree ? 'FREE' : 'PREMIUM'}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-5">
          Official IMAT {year} past paper — Biology, Chemistry, Physics, Maths,
          Logic & General Knowledge
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {hasAccess ? (
          <>
            <a
              href={`/papers/imat-${year}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-sm font-medium px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition"
            >
              👁 View
            </a>
            <a
              href={`/papers/imat-${year}.pdf`}
              download={`IMAT-${year}-Past-Paper.pdf`}
              className="flex-1 text-center text-sm font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ⬇ Download
            </a>
          </>
        ) : (
          <Link
            href="/dashboard/pricing"
            className="flex-1 text-center text-sm font-semibold px-4 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            🔒 Locked
          </Link>
        )}
      </div>
    </div>
  );
}
