import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { CompletionRule } from "@/types";

// GET — get all lesson progress for current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();

    const { data: lmsUser } = await supabaseAdmin
      .from("lms_users")
      .select("id")
      .eq("email", email)
      .single();

    if (!lmsUser) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("course_id");

    if (courseId) {
      // Get modules for course, then lessons, then progress
      const { data: modules } = await supabaseAdmin
        .from("modules")
        .select("id")
        .eq("course_id", courseId);

      if (!modules || modules.length === 0) {
        return NextResponse.json([]);
      }

      const moduleIds = modules.map((m: { id: string }) => m.id);

      const { data: lessons } = await supabaseAdmin
        .from("lessons")
        .select("id")
        .in("module_id", moduleIds);

      if (!lessons || lessons.length === 0) {
        return NextResponse.json([]);
      }

      const lessonIds = lessons.map((l: { id: string }) => l.id);

      const { data: progress, error } = await supabaseAdmin
        .from("lesson_progress")
        .select("*")
        .eq("user_id", lmsUser.id)
        .in("lesson_id", lessonIds);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(progress || []);
    }

    // No course filter — return all progress
    const { data: progress, error } = await supabaseAdmin
      .from("lesson_progress")
      .select("*")
      .eq("user_id", lmsUser.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(progress || []);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — update lesson progress
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const body = await req.json();
    const { lesson_id, status } = body;

    if (!lesson_id || !status) {
      return NextResponse.json({ error: "lesson_id and status are required" }, { status: 400 });
    }

    if (!["in_progress", "completed"].includes(status)) {
      return NextResponse.json({ error: "status must be 'in_progress' or 'completed'" }, { status: 400 });
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

    const now = new Date().toISOString();

    // Check existing progress
    const { data: existing } = await supabaseAdmin
      .from("lesson_progress")
      .select("*")
      .eq("user_id", lmsUser.id)
      .eq("lesson_id", lesson_id)
      .single();

    let progressRow;

    if (existing) {
      const updates: Record<string, unknown> = {
        status,
        updated_at: now,
      };
      if (status === "in_progress" && !existing.started_at) {
        updates.started_at = now;
      }
      if (status === "completed") {
        updates.completed_at = now;
        if (!existing.started_at) {
          updates.started_at = now;
        }
      }

      const { data, error } = await supabaseAdmin
        .from("lesson_progress")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      progressRow = data;
    } else {
      const row: Record<string, unknown> = {
        user_id: lmsUser.id,
        lesson_id,
        status,
      };
      if (status === "in_progress" || status === "completed") {
        row.started_at = now;
      }
      if (status === "completed") {
        row.completed_at = now;
      }

      const { data, error } = await supabaseAdmin
        .from("lesson_progress")
        .insert(row)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      progressRow = data;
    }

    // After marking complete, check if enrollment should be updated
    if (status === "completed") {
      await checkAndUpdateEnrollment(lmsUser.id, lesson_id);
    }

    return NextResponse.json(progressRow);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function checkAndUpdateEnrollment(userId: string, lessonId: string) {
  // Get the lesson's module -> course
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

  // Get enrollment
  const { data: enrollment } = await supabaseAdmin
    .from("enrollments")
    .select("id, status")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (!enrollment) return;

  // Get course for completion rule
  const { data: course } = await supabaseAdmin
    .from("courses")
    .select("completion_rule, min_score_pct")
    .eq("id", courseId)
    .single();

  if (!course) return;

  // Get all lessons for this course
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

  // Get all progress for this user + these lessons
  const { data: allProgress } = await supabaseAdmin
    .from("lesson_progress")
    .select("lesson_id, status")
    .eq("user_id", userId)
    .in("lesson_id", allLessonIds);

  const progressMap = new Map(
    (allProgress || []).map((p: { lesson_id: string; status: string }) => [p.lesson_id, p.status])
  );

  // Check completion rule
  const rule = course.completion_rule as CompletionRule;
  let isComplete = false;

  if (rule === "all_lessons") {
    isComplete = allLessons.every(
      (l: { id: string }) => progressMap.get(l.id) === "completed"
    );
  } else if (rule === "all_quizzes") {
    const quizLessons = allLessons.filter(
      (l: { id: string; lesson_type: string }) => l.lesson_type === "quiz"
    );
    if (quizLessons.length > 0) {
      // Check that all quiz lessons have a passed quiz_attempt
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
        // Get best attempt per quiz
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
  // 'manual' rule: never auto-complete

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
