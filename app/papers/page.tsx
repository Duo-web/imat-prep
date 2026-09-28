import Link from "next/link";

const papers = [
  { year: 2025, available: true },
  { year: 2024, available: true },
  { year: 2023, available: true },
  { year: 2022, available: false },
  { year: 2021, available: false },
  { year: 2020, available: false },
  { year: 2019, available: true },
  { year: 2018, available: true },
  { year: 2017, available: true },
  { year: 2016, available: true },
  { year: 2015, available: true },
];

export default function PapersPage() {
  const available = papers.filter((p) => p.available);
  const unavailable = papers.filter((p) => !p.available);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          📄 IMAT Past Papers
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Download all available IMAT past papers for free. No account required.
          Practice with real exam questions from 2015 to 2025.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full border border-green-200">
          ✅ {available.length} papers available — 100% free
        </div>
      </section>

      {/* Papers Grid */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Available Papers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {available.map((paper) => (
            <PaperCard key={paper.year} year={paper.year} />
          ))}
        </div>

        {/* Unavailable papers */}
        {unavailable.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-gray-400 mt-12 mb-6">
              Not Available
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {unavailable.map((paper) => (
                <UnavailableCard key={paper.year} year={paper.year} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">
            Want more than just past papers?
          </h2>
          <p className="text-blue-100 mb-6">
            Get unlimited practice questions, full exam simulators, and
            performance analytics — starting at just €12/month.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Start Free — No Card Needed
          </Link>
        </div>
      </section>
    </main>
  );
}

function PaperCard({ year }: { year: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Year badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold text-gray-900">{year}</span>
        <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
          FREE
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-5">
        Official IMAT {year} past paper — Biology, Chemistry, Physics, Maths,
        Logic & General Knowledge
      </p>

      {/* Actions */}
      <div className="flex gap-3">
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
      </div>
    </div>
  );
}

function UnavailableCard({ year }: { year: number }) {
  return (
    <div className="bg-white border border-dashed border-gray-200 rounded-xl p-6 opacity-50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl font-bold text-gray-400">{year}</span>
        <span className="text-xs font-semibold bg-gray-100 text-gray-400 px-3 py-1 rounded-full">
          NOT AVAILABLE
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-5">
        The IMAT {year} past paper is not publicly available.
      </p>
      <div className="flex gap-3">
        <button
          disabled
          className="flex-1 text-center text-sm font-medium px-4 py-2 border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed"
        >
          👁 View
        </button>
        <button
          disabled
          className="flex-1 text-center text-sm font-semibold px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
        >
          ⬇ Download
        </button>
      </div>
    </div>
  );
}
