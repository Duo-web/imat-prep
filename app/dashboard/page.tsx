import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 mb-8">
          Your IMAT preparation dashboard is coming soon. Check back on Day 8!
        </p>

        {/* Placeholder cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: "Questions Attempted", value: "0", icon: "🧠" },
            { label: "Correct Answers", value: "0%", icon: "✅" },
            { label: "Study Streak", value: "0 days", icon: "🔥" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-blue-700 font-medium">
            🚧 Full dashboard coming on Day 8 of the build. For now, go practice with{" "}
            <a href="/papers" className="underline font-semibold">
              past papers
            </a>
            !
          </p>
        </div>
      </div>
    </main>
  );
}
