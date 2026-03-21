import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { QuizOption } from "@/types";

// POST — submit quiz answers and grade
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const body = await req.json();
    const { quiz_id, answers } = body as { quiz_id: string; answers: Record<string, string[]> };

    if (!quiz_id || !answers) {
      return NextResponse.json({ error: "quiz_id and answers are required" }, { status: 400 });
    }

    // Get LMS user
    const { data: lmsUser } = await supabaseAdmin
      .from("lms_users")
      .select("id")
      .eq("email", email)
      .single();

    if (!lmsUser) {
      return NextResponse.json({ error: "LMS user not found" }, { status: 400 });
    }

    // Fetch quiz
    const { data: quiz, error: quizErr } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("id", quiz_id)
      .single();

    if (quizErr || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Fetch questions with correct answers
    const { data: questions } = await supabaseAdmin
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quiz_id)
      .order("sort_order", { ascending: true });

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: "Quiz has no questions" }, { status: 400 });
    }

    // Check max attempts
    if (quiz.max_attempts > 0) {
      const { count } = await supabaseAdmin
        .from("quiz_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", lmsUser.id)
        .eq("quiz_id", quiz_id);

      if ((count || 0) >= quiz.max_attempts) {
        return NextResponse.json({ error: "Maximum attempts reached" }, { status: 400 });
      }
    }

    // Grade each question
    let correctPoints = 0;
    let totalPoints = 0;
    const results: { question_id: string; correct: boolean; explanation: string | null }[] = [];

    for (const question of questions) {
      const options = question.options as QuizOption[];
      const userAnswer = answers[question.id] || [];
      const points = question.points || 1;
      totalPoints += points;

      let isCorrect = false;

      switch (question.question_type) {
        case "single_choice":
        case "true_false": {
          const correctOption = options.find((o) => o.is_correct);
          isCorrect = userAnswer.length === 1 && userAnswer[0] === correctOption?.id;
          break;
        }
        case "multi_choice": {
          const correctIds = new Set(
            options.filter((o) => o.is_correct).map((o) => o.id)
          );
          const userSet = new Set(userAnswer);
          isCorrect =
            correctIds.size === userSet.size &&
            Array.from(correctIds).every((id) => userSet.has(id));
          break;
        }
        case "fill_blank": {
          const correctTexts = options
            .filter((o) => o.is_correct)
            .map((o) => o.text.toLowerCase().trim());
          const userText = (userAnswer[0] || "").toLowerCase().trim();
          isCorrect = correctTexts.includes(userText);
          break;
        }
        case "ordering": {
          // User's answer is an array of option IDs in the order they placed them
          // Correct order is determined by position field
          const correctOrder = options
            .filter((o) => o.position !== undefined)
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .map((o) => o.id);
          isCorrect =
            userAnswer.length === correctOrder.length &&
            userAnswer.every((id, idx) => id === correctOrder[idx]);
          break;
        }
      }

      if (isCorrect) {
        correctPoints += points;
      }

      results.push({
        question_id: question.id,
        correct: isCorrect,
        explanation: question.explanation,
      });
    }

    // Calculate score
    const scorePct = totalPoints > 0 ? Math.round((correctPoints / totalPoints) * 100) : 0;
    const passed = scorePct >= quiz.passing_score;

    // Insert quiz attempt
    const now = new Date().toISOString();

    const { data: attempt, error: attemptErr } = await supabaseAdmin
      .from("quiz_attempts")
      .insert({
        user_id: lmsUser.id,
        quiz_id,
        answers,
        score_pct: scorePct,
        passed,
        started_at: now,
        completed_at: now,
      })
      .select()
      .single();

    if (attemptErr) {
      return NextResponse.json({ error: attemptErr.message }, { status: 500 });
    }

    // If passed, mark the quiz lesson as completed
    if (passed) {
      const lessonId = quiz.lesson_id;

      // Upsert lesson progress
      const { data: existingProgress } = await supabaseAdmin
        .from("lesson_progress")
        .select("id, started_at")
        .eq("user_id", lmsUser.id)
        .eq("lesson_id", lessonId)
        .single();

      if (existingProgress) {
        await supabaseAdmin
          .from("lesson_progress")
          .update({
            status: "completed",
            completed_at: now,
            started_at: existingProgress.started_at || now,
            updated_at: now,
          })
          .eq("id", existingProgress.id);
      } else {
        await supabaseAdmin
          .from("lesson_progress")
          .insert({
            user_id: lmsUser.id,
            lesson_id: lessonId,
            status: "completed",
            started_at: now,
            completed_at: now,
          });
      }

      // Check enrollment completion (inline the same logic as progress route)
      await checkAndUpdateEnrollment(lmsUser.id, lessonId);
    }

    return NextResponse.json({
      attempt_id: attempt.id,
      score_pct: scorePct,
      passed,
      results,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function checkAndUpdateEnrollment(userId: string, lessonId: string) {
  const { data: lesson } = await supabaseAdmin
    .from("lessons")
    .select("id, module_id")
    .eq("id", lessonId)
    .single();

  if (!lesson) return;

  const { data: mod } = await supabaseAdmin
    .from("modules")
    .select("course_id")
    .eq("id", lesson.module_id)
    .single();

  if (!mod) return;

  const courseId = mod.course_id;

  const { data: enrollment } = await supabaseAdmin
    .from("enrollments")
    .select("id, status")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) return;

  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("completion_rule, min_score_pct")
    .eq("id", courseId)
    .single();

  if (!course) return;

  const { data: modules } = await supabaseAdmin
    .from("modules")
    .select("id")
    .eq("course_id", courseId);

  if (!modules || modules.length === 0) return;

  const moduleIds = modules.map((m: { id: string }) => m.id);

  const { data: allLessons } = await supabaseAdmin
    .from("lessons")
    .select("id, lesson_type")
    .in("module_id", moduleIds);

  if (!allLessons || allLessons.length === 0) return;

  const allLessonIds = allLessons.map((l: { id: string }) => l.id);

  const { data: allProgress } = await supabaseAdmin
    .from("lesson_progress")
    .select("lesson_id, status")
    .eq("user_id", userId)
    .in("lesson_id", allLessonIds);

  const progressMap = new Map(
    (allProgress || []).map((p: { lesson_id: string; status: string }) => [p.lesson_id, p.status])
  );

  let isComplete = false;
  const rule = course.completion_rule;

  if (rule === "all_lessons") {
    isComplete = allLessons.every(
      (l: { id: string }) => progressMap.get(l.id) === "completed"
    );
  } else if (rule === "all_quizzes") {
    const quizLessons = allLessons.filter(
      (l: { id: string; lesson_type: string }) => l.lesson_type === "quiz"
    );
    if (quizLessons.length > 0) {
      const quizLessonIds = quizLessons.map((l: { id: string }) => l.id);
      const { data: quizzes } = await supabaseAdmin
        .from("quizzes")
        .select("id")
        .in("lesson_id", quizLessonIds);

      if (quizzes && quizzes.length > 0) {
        const quizIds = quizzes.map((q: { id: string }) => q.id);
        const { data: attempts } = await supabaseAdmin
          .from("quiz_attempts")
          .select("quiz_id, passed")
          .eq("user_id", userId)
          .in("quiz_id", quizIds)
          .eq("passed", true);

        const passedQuizIds = new Set(
          (attempts || []).map((a: { quiz_id: string }) => a.quiz_id)
        );
        isComplete = quizzes.every(
          (q: { id: string }) => passedQuizIds.has(q.id)
        );
      }
    }
  } else if (rule === "min_score") {
    const quizLessons = allLessons.filter(
      (l: { id: string; lesson_type: string }) => l.lesson_type === "quiz"
    );
    if (quizLessons.length > 0) {
      const quizLessonIds = quizLessons.map((l: { id: string }) => l.id);
      const { data: quizzes } = await supabaseAdmin
        .from("quizzes")
        .select("id")
        .in("lesson_id", quizLessonIds);

      if (quizzes && quizzes.length > 0) {
        const quizIds = quizzes.map((q: { id: string }) => q.id);
        const { data: attempts } = await supabaseAdmin
          .from("quiz_attempts")
          .select("quiz_id, score_pct")
          .eq("user_id", userId)
          .in("quiz_id", quizIds);

        if (attempts && attempts.length > 0) {
          const bestByQuiz = new Map<string, number>();
          for (const a of attempts) {
            const current = bestByQuiz.get(a.quiz_id) || 0;
            if (a.score_pct > current) {
              bestByQuiz.set(a.quiz_id, a.score_pct);
            }
          }

          if (bestByQuiz.size === quizzes.length) {
            const scores = Array.from(bestByQuiz.values());
            const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
            isComplete = avg >= (course.min_score_pct || 0);
          }
        }
      }
    }
  }

  const now = new Date().toISOString();

  if (isComplete) {
    await supabaseAdmin
      .from("enrollments")
      .update({ status: "completed", completed_at: now, updated_at: now })
      .eq("id", enrollment.id);
  } else if (enrollment.status === "enrolled") {
    await supabaseAdmin
      .from("enrollments")
      .update({ status: "in_progress", updated_at: now })
      .eq("id", enrollment.id);
  }
}
