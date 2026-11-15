import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          🎓 IMAT Prep Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          The smarter, cheaper way to prepare for the IMAT exam. Free past
          papers, practice questions, simulators, and analytics — all in one
          place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/papers"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Free Past Papers
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Start Free — No Card Needed
          </Link>
        </div>

        {/* Pricing Teaser — descriptions must match what /pricing and the code deliver */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            { plan: "Free", price: "€0", desc: "Past papers + 10 questions a day" },
            { plan: "Season pass", price: "€79", desc: "Unlimited questions + full simulators" },
            { plan: "Lifetime", price: "€149", desc: "The same, every season after" },
          ].map((item) => (
            <div
              key={item.plan}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl text-left"
            >
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.plan}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.price}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-400">
          <Link href="/pricing" className="font-medium text-blue-600 hover:underline">
            What's included, and how to pay →
          </Link>
        </p>

        <p className="mt-6 text-sm text-gray-400">
          vs. IMAT Buddy at €279/year — no monthly option, no free trial
        </p>
      </section>
    </main>
  );
}
