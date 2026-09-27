import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Start your IMAT prep today — no card needed.",
    features: [
      "All IMAT past papers (PDF download)",
      "10 practice questions per day",
      "IMAT news & exam date updates",
      "Basic score tracking",
    ],
    cta: "Get Started Free",
    ctaHref: "/register",
    highlight: false,
    badge: null,
  },
  {
    name: "Monthly",
    price: "€12",
    period: "per month",
    description: "Full access with no long-term commitment.",
    features: [
      "Everything in Free",
      "Unlimited practice questions",
      "Worked solutions for every question",
      "30+ full exam simulators",
      "Performance dashboard",
      "Section-wise analytics",
    ],
    cta: "Start Monthly",
    ctaHref: "/register?plan=monthly",
    highlight: false,
    badge: null,
  },
  {
    name: "Yearly",
    price: "€79",
    period: "per year",
    description: "Best value. Save €65 vs monthly billing.",
    features: [
      "Everything in Monthly",
      "Smart personalised study planner",
      "Advanced performance analytics",
      "Progress charts over time",
      "Priority email support",
      "Dark mode",
    ],
    cta: "Get Yearly — Best Value",
    ctaHref: "/register?plan=yearly",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Lifetime",
    price: "€149",
    period: "one-time",
    description: "Pay once, use forever. No renewals ever.",
    features: [
      "Everything in Yearly",
      "Lifetime access — no renewals",
      "All future features included",
      "Per-question community forum",
      "Early access to new features",
    ],
    cta: "Get Lifetime Access",
    ctaHref: "/register?plan=lifetime",
    highlight: false,
    badge: null,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            No hidden fees. No tricks. The leading competitor charges{" "}
            <span className="line-through text-red-400">€279/year</span> with no
            free tier. We charge{" "}
            <span className="text-green-500 font-semibold">€79/year</span> with a
            free tier built in.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-6 border transition-all ${
                plan.highlight
                  ? "bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-200 dark:shadow-blue-900/40 scale-105"
                  : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow">
                    ⭐ {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <p
                className={`text-sm font-semibold mb-1 ${
                  plan.highlight ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {plan.name}
              </p>

              {/* Price */}
              <div className="flex items-end gap-1 mb-1">
                <span
                  className={`text-4xl font-extrabold ${
                    plan.highlight ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm mb-1 ${
                    plan.highlight ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p
                className={`text-sm mb-6 ${
                  plan.highlight ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {plan.description}
              </p>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`block text-center text-sm font-semibold py-3 rounded-xl mb-6 transition-all ${
                  plan.highlight
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <span
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.highlight ? "text-blue-200" : "text-green-500"
                      }`}
                    >
                      ✓
                    </span>
                    <span
                      className={
                        plan.highlight ? "text-blue-50" : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Guarantee note */}
        <p className="text-center text-sm text-gray-400 mt-10">
          🔒 Secure payment via Stripe &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; 7-day money-back guarantee
        </p>
      </div>
    </section>
  );
}
