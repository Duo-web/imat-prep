import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const paperId = formData.get('paperId') as string;
  const mode = formData.get('mode') as string;

  // Enforce free tier limits (for simplicity, we are skipping the full date check here and just creating the session)
  // Day 3 schema has DailyQuestionLimit, but Day 5 only says "Question bank & quiz engine"

  let totalQuestions = 10; // Default for random
  if (paperId) {
    const paper = await db.paper.findUnique({
      where: { id: paperId },
      include: { _count: { select: { questions: true } } }
    });
    if (paper) {
      totalQuestions = paper._count.questions;
    }
  }

  // Create a new Session
  const quizSession = await db.session.create({
    data: {
      userId: session.user.id,
      paperId: paperId || null,
      mode: "PRACTICE",
      score: 0,
      totalQuestions,
      timeTaken: 0,
    }
  });

  return NextResponse.redirect(new URL(`/quiz/${quizSession.id}`, request.url), 303);
}
