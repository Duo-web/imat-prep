import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuizMode } from "@prisma/client";

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

    // ─── PRACTICE MODE ────────────────────────────────────────────────────────
    // In practice mode every question is submitted one-by-one via /api/quiz/submit,
    // which already creates Attempt rows and increments correctCount on the session.
    // We only need to mark the session as completed here — we must NOT re-count from
    // the answers{} dict because that would double the correctCount.
    if (quizSession.mode === QuizMode.PRACTICE) {
      // Re-read the current correctCount that was accumulated by /submit calls
      const currentSession = await db.session.findUnique({
        where: { id: sessionId },
        select: { correctCount: true, totalQuestions: true, attempts: { select: { isCorrect: true } } },
      });

      const correctCount = currentSession?.correctCount ?? 0;
      const totalAnswered = currentSession?.attempts.length ?? 0;
      const totalQuestions = currentSession?.totalQuestions ?? quizSession.totalQuestions;

      // IMAT scoring: +1.5 correct, -0.4 wrong, 0 blank
      const wrongCount = totalAnswered - correctCount;
      const imatScore = parseFloat((correctCount * 1.5 - wrongCount * 0.4).toFixed(2));
      const maxScore = parseFloat((totalQuestions * 1.5).toFixed(2));

      const updatedSession = await db.session.update({
        where: { id: sessionId },
        data: {
          completed: true,
          score: imatScore,
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
        blankCount: totalQuestions - totalAnswered,
        totalQuestions,
        timeTaken,
      });
    }

    // ─── EXAM MODE ────────────────────────────────────────────────────────────
    // In exam mode the user sees all questions then submits everything at once.
    // No per-question /submit calls are made, so we count from the answers{} dict
    // and create all Attempt rows here.

    // Fetch the exact question set the session was built with
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

      userAnswers[q.id] = { selected, isCorrect, correct: q.correctAnswer };

      if (selected) {
        // In exam mode there should be no existing attempt, but guard just in case
        const existingAttempt = quizSession.attempts.find(
          (a) => a.questionId === q.id
        );
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

    // IMAT Official Scoring Formula: +1.5 correct, -0.4 wrong, 0 blank
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
