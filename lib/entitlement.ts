/**
 * lib/entitlement.ts
 *
 * The single answer to "may this student use the paid product?".
 *
 * It reads the database on every call. The JWT carries a subscriptionStatus too, but
 * that token is minted at sign-in — trusting it means a student who just paid stays
 * locked out until they log out, and a student whose access was revoked stays in.
 */

import { db } from "./db";
import { SubscriptionStatus } from "@prisma/client";

export type Access = {
  plan: SubscriptionStatus;
  expiresAt: Date | null; // null = lifetime
};

export async function getAccess(userId: string): Promise<Access | null> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, subscriptionEnd: true },
  });

  if (!user || user.subscriptionStatus === SubscriptionStatus.FREE) return null;

  if (user.subscriptionEnd && user.subscriptionEnd.getTime() < Date.now()) {
    // Expire lazily so the stored state matches what the student actually has.
    await db.user.update({
      where: { id: userId },
      data: { subscriptionStatus: SubscriptionStatus.FREE, subscriptionEnd: null },
    });
    return null;
  }

  return { plan: user.subscriptionStatus, expiresAt: user.subscriptionEnd };
}

export async function hasAccess(userId: string): Promise<boolean> {
  return (await getAccess(userId)) !== null;
}

/** Days of access a plan grants. LIFETIME and unknown plans return null (no end date). */
export function planDurationDays(plan: SubscriptionStatus): number | null {
  switch (plan) {
    case SubscriptionStatus.MONTHLY:
      return 30;
    case SubscriptionStatus.YEARLY:
      return 365;
    default:
      return null;
  }
}
