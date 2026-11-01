/**
 * scripts/manage-access.ts — the operator's tool for money that arrives off-site.
 *
 *   npm run access -- codes --plan YEARLY --seats 40 --partner pava --note "cohort 1"
 *   npm run access -- pay   --email a@b.com --plan YEARLY --amount 79 --ref BIN-8821
 *   npm run access -- refund --email a@b.com
 *   npm run access -- show  --email a@b.com
 *
 * Plans: MONTHLY (30 days) · YEARLY (365 days) · LIFETIME (no end date).
 */

import { SubscriptionStatus } from "@prisma/client";
import { db } from "../lib/db";
import { issueAccessCode, recordManualPayment, refundPurchase } from "../lib/access";

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function has(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

const PLANS: Record<string, SubscriptionStatus> = {
  MONTHLY: SubscriptionStatus.MONTHLY,
  YEARLY: SubscriptionStatus.YEARLY,
  LIFETIME: SubscriptionStatus.LIFETIME,
};

function plan(): SubscriptionStatus {
  const raw = (arg("plan") ?? "YEARLY").toUpperCase();
  const parsed = PLANS[raw];
  if (!parsed) {
    throw new Error(`Unknown plan "${raw}". Use MONTHLY, YEARLY or LIFETIME.`);
  }
  return parsed;
}

async function userByEmail(email: string | undefined) {
  if (!email) throw new Error("--email is required");
  const user = await db.user.findUnique({ where: { email }, select: { id: true, email: true } });
  if (!user) throw new Error(`No account with that email: ${email}`);
  return user;
}

function when(expiresAt: Date | null): string {
  return expiresAt === null ? "lifetime" : expiresAt.toISOString().slice(0, 10);
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case "codes": {
      const created = await issueAccessCode({
        plan: plan(),
        maxRedemptions: Number(arg("seats", "1")),
        partnerCode: arg("partner"),
        note: arg("note"),
        redeemBy: arg("by") ? new Date(`${arg("by")}T23:59:59Z`) : undefined,
      });
      console.log(
        [
          "",
          `  CODE      ${created.code}`,
          `  PLAN      ${created.plan}`,
          `  SEATS     ${created.maxRedemptions}`,
          `  PARTNER   ${created.partnerCode ?? "—"}`,
          `  REDEEM BY ${created.expiresAt ? created.expiresAt.toISOString().slice(0, 10) : "no deadline"}`,
          "",
        ].join("\n")
      );
      break;
    }

    case "pay": {
      const user = await userByEmail(arg("email"));
      const purchase = await recordManualPayment({
        userId: user.id,
        plan: plan(),
        amount: Number(arg("amount", "0")),
        currency: arg("currency", "EUR"),
        provider: (arg("provider", "MANUAL") ?? "MANUAL").toUpperCase() as
          | "MANUAL"
          | "BINANCE"
          | "PAYONEER",
        externalRef: arg("ref"),
        partnerCode: arg("partner"),
      });
      console.log(`\n  Paid. ${user.email} → ${purchase.plan} until ${when(purchase.expiresAt)}\n`);
      break;
    }

    case "refund": {
      const user = await userByEmail(arg("email"));
      const live = await db.purchase.findFirst({
        where: { userId: user.id, status: "PAID" },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      if (!live) throw new Error(`No paid purchase for ${user.email}`);
      await refundPurchase(live.id);
      console.log(`\n  Refunded ${live.id}. Access revoked unless another purchase is live.\n`);
      break;
    }

    case "show": {
      const user = await userByEmail(arg("email"));
      const [purchases, access] = await Promise.all([
        db.purchase.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        db.user.findUniqueOrThrow({
          where: { id: user.id },
          select: { subscriptionStatus: true, subscriptionEnd: true },
        }),
      ]);
      console.log(
        `\n  ${user.email} — ${access.subscriptionStatus}` +
          (access.subscriptionStatus === "FREE"
            ? " (no active access)\n"
            : ` until ${when(access.subscriptionEnd)}\n`)
      );
      for (const p of purchases) {
        console.log(
          `    ${p.createdAt.toISOString().slice(0, 10)}  ${p.status.padEnd(9)} ${p.plan.padEnd(8)} ${String(p.amount)} ${p.currency}  ${p.provider}  ${p.externalRef ?? ""}`
        );
      }
      console.log("");
      break;
    }

    default:
      console.log(
        "\n  Usage: npm run access -- codes | pay | refund | show  (see scripts/manage-access.ts)\n"
      );
  }
}

main()
  .catch((error) => {
    console.error(`\n  ✗ ${error instanceof Error ? error.message : error}\n`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
