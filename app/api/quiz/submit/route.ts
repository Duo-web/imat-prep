import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { sessionId, questionId, selectedAnswer, timeTaken } = await request.json();

    if (!sessionId || !questionId || !selectedAnswer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Verify session belongs to user
    const quizSession = await db.session.findUnique({
      where: { id: sessionId }
    });

    if (!quizSession || quizSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get the question to check correct answer
    const question = await db.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const isCorrect = question.correctAnswer === selectedAnswer;

    // Save the attempt
    await db.attempt.create({
      data: {
        userId: session.user.id,
        questionId: question.id,
        selectedAnswer,
        isCorrect,
        timeTaken: timeTaken || 0,
        sessionId: quizSession.id,
      }
    });

    // Update session score/correct count
    await db.session.update({
      where: { id: quizSession.id },
      data: {
        correctCount: {
          increment: isCorrect ? 1 : 0
        },
        timeTaken: {
          increment: timeTaken || 0
        }
      }
    });

    // Check if session is completed (optional logic here, skipping complex checks for now)
    
    return NextResponse.json({ isCorrect });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
