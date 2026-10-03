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
    const { sessionId, timeTaken, answers } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const quizSession = await db.session.findUnique({
      where: { id: sessionId },
      include: { attempts: true },
    });

    if (!quizSession || quizSession.userId !== session.user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Fetch questions for this session
    const whereClause: any = { isActive: true };
    if (quizSession.paperId) {
      whereClause.paperId = quizSession.paperId;
    } else if (quizSession.sectionFilter) {
      whereClause.section = quizSession.sectionFilter;
    }

    const questions = await db.question.findMany({
      where: whereClause,
      take: quizSession.totalQuestions,
      orderBy: { id: "asc" },
    });

    let correctCount = 0;
    let wrongCount = 0;
    let blankCount = 0;
    const userAnswers: Record<string, { selected: string; isCorrect: boolean; correct: string }> = {};

    // Process attempts
    for (const q of questions) {
      const selected = answers?.[q.id] || "";
      let isCorrect = false;

      if (!selected) {
        blankCount++;
      } else if (selected === q.correctAnswer) {
        correctCount++;
        isCorrect = true;
      } else {
        wrongCount++;
      }

      userAnswers[q.id] = {
        selected,
        isCorrect,
        correct: q.correctAnswer,
      };

      if (selected) {
        // Record or update attempt
        const existingAttempt = quizSession.attempts.find((a) => a.questionId === q.id);
        if (existingAttempt) {
          await db.attempt.update({
            where: { id: existingAttempt.id },
            data: { selectedAnswer: selected, isCorrect, timeTaken: timeTaken || 0 },
          });
        } else {
          await db.attempt.create({
            data: {
              userId: session.user.id,
              questionId: q.id,
              selectedAnswer: selected,
              isCorrect,
              timeTaken: Math.round((timeTaken || 0) / (questions.length || 1)),
              sessionId: quizSession.id,
            },
          });
        }
      }
    }

    // IMAT Official Scoring Formula: +1.5 for correct, -0.4 for incorrect, 0 for blank
    const imatScore = parseFloat((correctCount * 1.5 - wrongCount * 0.4).toFixed(2));
    const maxScore = parseFloat((questions.length * 1.5).toFixed(2));

    const updatedSession = await db.session.update({
      where: { id: quizSession.id },
      data: {
        completed: true,
        score: imatScore,
        correctCount,
        timeTaken: timeTaken || quizSession.timeTaken,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: updatedSession.id,
      score: imatScore,
      maxScore,
      correctCount,
      wrongCount,
      blankCount,
      totalQuestions: questions.length,
      timeTaken,
      userAnswers,
    });
  } catch (error) {
    console.error("Finish quiz error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
