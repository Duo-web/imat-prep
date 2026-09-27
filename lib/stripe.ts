import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "All IMAT past papers (PDF download)",
      "10 practice questions per day",
      "IMAT news and updates",
    ],
  },
  MONTHLY: {
    name: "Monthly",
    price: 12,
    priceId: process.env.STRIPE_PRICE_MONTHLY,
    features: [
      "Everything in Free",
      "Unlimited practice questions",
      "Worked solutions for all questions",
      "30+ full exam simulators",
      "Performance dashboard",
    ],
  },
  YEARLY: {
    name: "Yearly",
    price: 79,
    priceId: process.env.STRIPE_PRICE_YEARLY,
    features: [
      "Everything in Monthly",
      "Smart study planner",
      "Advanced analytics",
      "Section-wise breakdown",
      "Priority support",
    ],
  },
  LIFETIME: {
    name: "Lifetime",
    price: 149,
    priceId: process.env.STRIPE_PRICE_LIFETIME,
    features: [
      "Everything in Yearly",
      "Lifetime access — no renewals",
      "All future features included",
      "Community forum access",
    ],
  },
};
