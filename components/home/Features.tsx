const features = [
  {
    emoji: "📄",
    title: "Free Past Papers",
    description:
      "Download all official IMAT past papers from 2015–2025 as free PDFs. No account needed. No strings attached.",
    badge: "Always Free",
    badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  {
    emoji: "🧠",
    title: "Adaptive Practice",
    description:
      "10 free questions daily. Go premium for unlimited practice with worked solutions that explain every answer.",
    badge: "10/day Free",
    badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  },
  {
    emoji: "🧪",
    title: "30+ Exam Simulators",
    description:
      "Full timed mock exams that mimic the real IMAT format — all 60 questions, exact scoring, section breakdown.",
    badge: "Premium",
    badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },
  {
    emoji: "📊",
    title: "Performance Dashboard",
    description:
      "Track your scores over time, identify weak topics, and see exactly where to focus your study energy.",
    badge: "Premium",
    badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },
  {
    emoji: "📅",
    title: "Smart Study Planner",
    description:
      "Enter your exam date and get a personalised day-by-day study plan built around your strengths and gaps.",
    badge: "Yearly+",
    badgeColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  },
  {
    emoji: "📈",
    title: "Progress Analytics",
    description:
      "Beautiful charts showing improvement over time — Biology, Chemistry, Physics, Maths, Logic — all tracked.",
    badge: "Yearly+",
    badgeColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  },
  {
    emoji: "💬",
    title: "Per-Question Forum",
    description:
      "Every question has its own discussion thread. Ask, answer, and learn from the community.",
    badge: "Premium",
    badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  },
  {
    emoji: "🌙",
    title: "Dark Mode + Mobile",
    description:
      "Fully mobile-optimised with dark mode. Study anywhere — on your phone, tablet, or laptop.",
    badge: "All Plans",
    badgeColor: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              pass the IMAT
            </span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            From free past papers to AI-powered analytics — we have built every
            tool a serious IMAT student needs.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-50 dark:hover:shadow-blue-900/10 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{feature.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  {feature.title}
                </h3>
              </div>
              <span
                className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${feature.badgeColor}`}
              >
                {feature.badge}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
