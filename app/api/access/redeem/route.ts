import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { AccessCodeError, redeemAccessCode } from "@/lib/access";

const body = z.object({
  code: z.string().min(6).max(32),
});

const FAILURES: Record<string, string> = {
  NOT_FOUND: "That code doesn't exist. Check it was typed exactly as sent.",
  REVOKED: "That code has been cancelled. Contact us and we'll sort it out.",
  EXPIRED: "That code expired before it was used. Contact us and we'll reissue it.",
  EXHAUSTED: "Every seat on that code has already been claimed.",
  ALREADY_REDEEMED: "You've already used this code — your access is active.",
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in before redeeming a code." }, { status: 401 });
  }

  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid access code." }, { status: 400 });
  }

  try {
    const granted = await redeemAccessCode(session.user.id, parsed.data.code);
    return NextResponse.json({
      plan: granted.plan,
      expiresAt: granted.expiresAt, // null = lifetime
      message:
        granted.expiresAt === null
          ? "You're in — lifetime access."
          : `You're in — access until ${granted.expiresAt.toLocaleDateString("en-GB")}.`,
    });
  } catch (error) {
    if (error instanceof AccessCodeError) {
      return NextResponse.json(
        { error: FAILURES[error.reason] ?? "That code could not be used." },
        { status: 400 }
      );
    }
    throw error;
  }
}
