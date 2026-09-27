const steps = [
  {
    step: "01",
    emoji: "📄",
    title: "Download Free Past Papers",
    description:
      "Grab all IMAT past papers (2015–2025) as free PDFs — no account needed. Get familiar with the exam format and question style.",
  },
  {
    step: "02",
    emoji: "🧠",
    title: "Practice by Topic",
    description:
      "Work through Biology, Chemistry, Physics, Maths, and Logic questions. Each wrong answer comes with a full explanation.",
  },
  {
    step: "03",
    emoji: "📊",
    title: "Track Your Progress",
    description:
      "Your dashboard shows your score trends, weak topics, and how you compare to other students — so you know exactly where to focus.",
  },
  {
    step: "04",
    emoji: "🧪",
    title: "Simulate the Real Exam",
    description:
      "Take full timed mock exams under real conditions. 60 questions, 100 minutes — just like exam day. Review every answer afterwards.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Four steps from zero to exam-ready.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative flex flex-col items-start">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(100%_-_1rem)] w-full h-0.5 bg-gradient-to-r from-blue-200 to-gray-200 dark:from-blue-900 dark:to-gray-800 z-0" />
              )}

              {/* Step number bubble */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-4">
                <span className="text-2xl">{step.emoji}</span>
              </div>

              {/* Step badge */}
              <span className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-2 tracking-widest">
                STEP {step.step}
              </span>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
