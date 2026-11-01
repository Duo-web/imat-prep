import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuizMode, Section } from "@prisma/client";
import { getAccess } from "@/lib/entitlement";

// Free tier: max 10 questions per calendar day
const FREE_DAILY_LIMIT = 10;

/** Returns midnight UTC for today as a Date (used as the DailyQuestionLimit.date key). */
function todayUTC(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") || "";
  let mode: QuizMode = QuizMode.PRACTICE;
  let paperId: string | null = null;
  let sectionFilter: string | null = null;
  let requestedLimit = 10;
  const isJsonRequest = contentType.includes("application/json");

  if (isJsonRequest) {
    const body = await request.json();
    if (body.mode === "EXAM") mode = QuizMode.EXAM;
    if (body.paperId) paperId = body.paperId;
    if (body.section && body.section !== "ALL") sectionFilter = body.section;
    if (body.limit) requestedLimit = parseInt(body.limit, 10);
  } else {
    const formData = await request.formData();
    const rawMode = formData.get("mode") as string;
    if (rawMode === "EXAM") mode = QuizMode.EXAM;
    paperId = (formData.get("paperId") as string) || null;
    const rawSection = formData.get("section") as string;
    if (rawSection && rawSection !== "ALL") sectionFilter = rawSection;
    const rawLimit = formData.get("limit") as string;
    if (rawLimit) requestedLimit = parseInt(rawLimit, 10);
  }

  // ─── Daily Question Limit check (Free tier only) ──────────────────────────
  // Access is read from the database, not the session token, so a student who paid
  // five minutes ago is not still counted against the free allowance.
  const isFreeUser = (await getAccess(session.user.id)) === null;

  if (isFreeUser) {
    const today = todayUTC();

    const todayRecord = await db.dailyQuestionLimit.findUnique({
      where: { userId_date: { userId: session.user.id, date: today } },
    });

    const questionsUsedToday = todayRecord?.questionsUsed ?? 0;
    const remaining = FREE_DAILY_LIMIT - questionsUsedToday;

    if (remaining <= 0) {
      return NextResponse.json(
        {
          error: "Daily question limit reached",
          message:
            "Free accounts get 10 questions per day. Upgrade to Premium for unlimited access.",
          limitReached: true,
          questionsUsed: questionsUsedToday,
          dailyLimit: FREE_DAILY_LIMIT,
        },
        { status: 403 }
      );
    }

    // Cap the requested session size to the remaining daily quota
    requestedLimit = Math.min(requestedLimit, remaining);
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Count available questions based on filters
  const whereClause: any = { isActive: true };
  if (paperId) whereClause.paperId = paperId;
  if (sectionFilter) whereClause.section = sectionFilter as Section;

  const matchingQuestionsCount = await db.question.count({
    where: whereClause,
  });

  const totalQuestions = Math.min(
    requestedLimit || (mode === QuizMode.EXAM ? 60 : 10),
    matchingQuestionsCount > 0
      ? matchingQuestionsCount
      : mode === QuizMode.EXAM
      ? 60
      : 10
  );

  // Create the session
  const quizSession = await db.session.create({
    data: {
      userId: session.user.id,
      paperId: paperId || null,
      mode,
      sectionFilter,
      score: 0,
      totalQuestions: totalQuestions > 0 ? totalQuestions : 10,
      timeTaken: 0,
    },
  });

  // ─── Record daily usage for free users ────────────────────────────────────
  if (isFreeUser) {
    const today = todayUTC();
    const newTotal = (
      await db.dailyQuestionLimit.findUnique({
        where: { userId_date: { userId: session.user.id, date: today } },
        select: { questionsUsed: true },
      })
    )?.questionsUsed ?? 0;

    const updatedUsed = newTotal + totalQuestions;

    await db.dailyQuestionLimit.upsert({
      where: { userId_date: { userId: session.user.id, date: today } },
      update: {
        questionsUsed: updatedUsed,
        limitReached: updatedUsed >= FREE_DAILY_LIMIT,
      },
      create: {
        userId: session.user.id,
        date: today,
        questionsUsed: totalQuestions,
        limitReached: totalQuestions >= FREE_DAILY_LIMIT,
      },
    });
  }
  // ─────────────────────────────────────────────────────────────────────────

  if (isJsonRequest) {
    return NextResponse.json({
      sessionId: quizSession.id,
      url: `/quiz/${quizSession.id}`,
    });
  }

  return NextResponse.redirect(
    new URL(`/quiz/${quizSession.id}`, request.url),
    303
  );
}
