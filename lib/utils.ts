import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Subscription helpers ────────────────────────────────────────────────────

export type SubscriptionStatus = "FREE" | "MONTHLY" | "YEARLY" | "LIFETIME";

export function isPremium(status: SubscriptionStatus): boolean {
  return status === "MONTHLY" || status === "YEARLY" || status === "LIFETIME";
}

export function isYearlyOrLifetime(status: SubscriptionStatus): boolean {
  return status === "YEARLY" || status === "LIFETIME";
}

export function getPlanLabel(status: SubscriptionStatus): string {
  const labels: Record<SubscriptionStatus, string> = {
    FREE: "Free",
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
    LIFETIME: "Lifetime",
  };
  return labels[status];
}

export function getPlanBadgeColor(status: SubscriptionStatus): string {
  const colors: Record<SubscriptionStatus, string> = {
    FREE:     "bg-gray-100 text-gray-600",
    MONTHLY:  "bg-blue-100 text-blue-700",
    YEARLY:   "bg-violet-100 text-violet-700",
    LIFETIME: "bg-amber-100 text-amber-700",
  };
  return colors[status];
}

// ─── Number helpers ───────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function toPercent(value: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}
