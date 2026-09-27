import Link from "next/link";

const rows = [
  { feature: "Free past papers", us: true, them: true },
  { feature: "Free practice questions (10/day)", us: true, them: false },
  { feature: "Monthly plan", us: "€12/mo", them: false },
  { feature: "Yearly plan", us: "€79/yr", them: "€279/yr" },
  { feature: "Lifetime plan", us: "€149", them: false },
  { feature: "Built-in free tier", us: true, them: false },
  { feature: "Worked solutions", us: true, them: true },
  { feature: "Exam simulators", us: "30+", them: "30+" },
  { feature: "Performance analytics", us: true, them: false },
  { feature: "Adaptive practice", us: true, them: false },
  { feature: "Smart study planner", us: true, them: "Basic" },
  { feature: "Dark mode", us: true, them: false },
  { feature: "Mobile optimised (PWA)", us: true, them: false },
  { feature: "Per-question forum", us: true, them: "Basic" },
  { feature: "7-day money-back", us: true, them: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true)
    return <span className="text-green-500 text-lg font-bold">✓</span>;
  if (value === false)
    return <span className="text-red-400 text-lg font-bold">✗</span>;
  return <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{value}</span>;
}

export default function Comparison() {
  return (
    <section id="comparison" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Why choose us over{" "}
            <span className="text-red-400 line-through">IMAT Buddy</span>?
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Same core content, modern platform, 3.5× cheaper, with a free tier.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-900 dark:bg-gray-800 text-white text-sm font-semibold">
            <div className="px-6 py-4 text-gray-400">Feature</div>
            <div className="px-6 py-4 text-center">
              <span className="text-blue-400">🎓 IMATPrep</span>
              <span className="ml-2 text-xs text-green-400 font-normal">← You</span>
            </div>
            <div className="px-6 py-4 text-center text-gray-400">IMAT Buddy</div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 text-sm border-t border-gray-100 dark:border-gray-800 ${
                i % 2 === 0
                  ? "bg-white dark:bg-gray-950"
                  : "bg-gray-50 dark:bg-gray-900"
              }`}
            >
              <div className="px-6 py-3.5 text-gray-700 dark:text-gray-300 font-medium">
                {row.feature}
              </div>
              <div className="px-6 py-3.5 text-center">
                <Cell value={row.us} />
              </div>
              <div className="px-6 py-3.5 text-center">
                <Cell value={row.them} />
              </div>
            </div>
          ))}

          {/* Summary row */}
          <div className="grid grid-cols-3 bg-blue-600 text-white text-sm font-bold border-t border-blue-500">
            <div className="px-6 py-4">Total yearly cost</div>
            <div className="px-6 py-4 text-center text-green-300">€79/year</div>
            <div className="px-6 py-4 text-center text-red-300 line-through">€279/year</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-blue-900/30 text-lg"
          >
            Switch to IMATPrep — Start Free →
          </Link>
        </div>
      </div>
    </section>
  );
}
