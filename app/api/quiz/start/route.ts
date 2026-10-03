import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuizMode, Section } from "@prisma/client";

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
  let isJsonRequest = contentType.includes("application/json");

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

  // Count available questions based on filters
  const whereClause: any = { isActive: true };
  if (paperId) whereClause.paperId = paperId;
  if (sectionFilter) whereClause.section = sectionFilter as Section;

  const matchingQuestionsCount = await db.question.count({
    where: whereClause,
  });

  const totalQuestions = Math.min(
    requestedLimit || (mode === QuizMode.EXAM ? 60 : 10),
    matchingQuestionsCount > 0 ? matchingQuestionsCount : (mode === QuizMode.EXAM ? 60 : 10)
  );

  // Create a new Session
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

  if (isJsonRequest) {
    return NextResponse.json({ sessionId: quizSession.id, url: `/quiz/${quizSession.id}` });
  }

  return NextResponse.redirect(new URL(`/quiz/${quizSession.id}`, request.url), 303);
}
