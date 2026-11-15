/**
 * lib/access.ts
 *
 * Granting and revoking paid access, whatever route the money took.
 *
 * Every path — a Binance callback, a Payoneer transfer confirmed by hand, a partner's
 * classroom licence, a code typed into /pricing — ends up here, so the ledger and the
 * entitlement can never disagree.
 */

import { randomBytes } from "crypto";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import { db } from "./db";
import { planDurationDays } from "./entitlement";

/** No I/O/0/1 — a student reading a code aloud should not have to. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newAccessCode(): string {
  const bytes = randomBytes(8);
  const block = (offset: number, length: number) =>
    Array.from({ length }, (_, i) => ALPHABET[bytes[offset + i] % ALPHABET.length]).join("");
  return `IMAT-${block(0, 4)}-${block(4, 4)}`;
}

export function normaliseCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export type RedeemFailure =
  | "NOT_FOUND"
  | "REVOKED"
  | "EXPIRED"
  | "EXHAUSTED"
  | "ALREADY_REDEEMED";

export class AccessCodeError extends Error {
  constructor(public readonly reason: RedeemFailure) {
    super(reason);
    this.name = "AccessCodeError";
  }
}

export type IssuedCode = {
  id: string;
  code: string;
  plan: SubscriptionStatus;
  maxRedemptions: number;
  partnerCode: string | null;
  expiresAt: Date | null;
};

export async function issueAccessCode(input: {
  plan: SubscriptionStatus;
  maxRedemptions?: number;
  durationDays?: number | null;
  partnerCode?: string;
  note?: string;
  redeemBy?: Date;
}): Promise<IssuedCode> {
  const created = await db.accessCode.create({
    data: {
      code: newAccessCode(),
      plan: input.plan,
      durationDays:
        input.durationDays === undefined ? planDurationDays(input.plan) : input.durationDays,
      maxRedemptions: input.maxRedemptions ?? 1,
      partnerCode: input.partnerCode ?? null,
      note: input.note ?? null,
      expiresAt: input.redeemBy ?? null,
    },
    select: {
      id: true,
      code: true,
      plan: true,
      maxRedemptions: true,
      partnerCode: true,
      expiresAt: true,
    },
  });
  return created;
}

/**
 * Extends a student's access from whichever is later — today, or the end of what they
 * already hold — so an early renewal never silently shortens a paid period.
 */
async function applyGrant(
  tx: Prisma.TransactionClient,
  userId: string,
  plan: SubscriptionStatus,
  durationDays: number | null
): Promise<Date | null> {
  const user = await tx.user.findUniqueOrThrow({
    where: { id: userId },
    select: { subscriptionEnd: true },
  });

  if (durationDays === null) {
    await tx.user.update({
      where: { id: userId },
      data: { subscriptionStatus: plan, subscriptionEnd: null },
    });
    return null;
  }

  const now = Date.now();
  const currentEnd = user.subscriptionEnd ? user.subscriptionEnd.getTime() : 0;
  const from = Math.max(now, currentEnd);
  const expiresAt = new Date(from + durationDays * 86_400_000);

  await tx.user.update({
    where: { id: userId },
    data: { subscriptionStatus: plan, subscriptionEnd: expiresAt },
  });
  return expiresAt;
}

export async function redeemAccessCode(userId: string, rawCode: string) {
  const code = normaliseCode(rawCode);

  return db.$transaction(async (tx) => {
    const accessCode = await tx.accessCode.findUnique({ where: { code } });

    if (!accessCode || accessCode.revoked) {
      throw new AccessCodeError(accessCode ? "REVOKED" : "NOT_FOUND");
    }
    if (accessCode.expiresAt && accessCode.expiresAt.getTime() < Date.now()) {
      throw new AccessCodeError("EXPIRED");
    }
    if (
      await tx.purchase.findFirst({
        where: { accessCodeId: accessCode.id, userId },
        select: { id: true },
      })
    ) {
      throw new AccessCodeError("ALREADY_REDEEMED");
    }

    // Conditional increment: two students redeeming the last seat at once cannot both win.
    const claimed = await tx.accessCode.updateMany({
      where: { id: accessCode.id, redeemedCount: { lt: accessCode.maxRedemptions } },
      data: { redeemedCount: { increment: 1 } },
    });
    if (claimed.count === 0) throw new AccessCodeError("EXHAUSTED");

    const expiresAt = await applyGrant(tx, userId, accessCode.plan, accessCode.durationDays);

    const purchase = await tx.purchase.create({
      data: {
        userId,
        plan: accessCode.plan,
        provider: "CODE",
        status: "PAID",
        amount: 0,
        currency: "EUR",
        accessCodeId: accessCode.id,
        partnerCode: accessCode.partnerCode,
        grantedAt: new Date(),
        expiresAt,
      },
      select: { id: true },
    });

    // A student introduced by a partner keeps that attribution; an unattributed
    // student inherits the partner whose code they used.
    if (accessCode.partnerCode) {
      await tx.user.update({
        where: { id: userId, partnerCode: null },
        data: { partnerCode: accessCode.partnerCode },
      });
    }

    return {
      purchaseId: purchase.id,
      plan: accessCode.plan,
      expiresAt,
      partnerCode: accessCode.partnerCode,
    };
  });
}

/** Records money that arrived outside the app and grants the access it bought. */
export async function recordManualPayment(input: {
  userId: string;
  plan: SubscriptionStatus;
  amount: number;
  currency?: string;
  provider?: "MANUAL" | "BINANCE" | "PAYONEER";
  externalRef?: string;
  partnerCode?: string;
  durationDays?: number | null;
}) {
  const durationDays =
    input.durationDays === undefined ? planDurationDays(input.plan) : input.durationDays;

  return db.$transaction(async (tx) => {
    const expiresAt = await applyGrant(tx, input.userId, input.plan, durationDays);

    return tx.purchase.create({
      data: {
        userId: input.userId,
        plan: input.plan,
        provider: input.provider ?? "MANUAL",
        status: "PAID",
        amount: new Prisma.Decimal(input.amount),
        currency: input.currency ?? "EUR",
        externalRef: input.externalRef ?? null,
        partnerCode: input.partnerCode ?? null,
        grantedAt: new Date(),
        expiresAt,
      },
      select: { id: true, plan: true, expiresAt: true },
    });
  });
}

/**
 * Refund: the ledger says refunded, the entitlement comes off unless they hold another
 * live purchase. Money itself moves by hand (Binance/Payoneer payout), not from here.
 */
export async function refundPurchase(purchaseId: string) {
  return db.$transaction(async (tx) => {
    const purchase = await tx.purchase.findUniqueOrThrow({
      where: { id: purchaseId },
      select: { userId: true },
    });

    await tx.purchase.update({
      where: { id: purchaseId },
      data: { status: "REFUNDED", refundedAt: new Date() },
    });

    if (purchase.userId) {
      const stillPaid = await tx.purchase.findFirst({
        where: {
          userId: purchase.userId,
          status: "PAID",
          id: { not: purchaseId },
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        select: { id: true },
      });
      if (!stillPaid) {
        await tx.user.update({
          where: { id: purchase.userId },
          data: { subscriptionStatus: "FREE", subscriptionEnd: null },
        });
      }
    }

    return { ok: true } as const;
  });
}
