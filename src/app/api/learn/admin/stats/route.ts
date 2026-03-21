import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET — admin stats dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Total users
    const { count: totalUsers } = await supabaseAdmin
      .from("lms_users")
      .select("id", { count: "exact", head: true });

    // Total enrollments + completed enrollments
    const { count: totalEnrollments } = await supabaseAdmin
      .from("enrollments")
      .select("id", { count: "exact", head: true });

    const { count: completedEnrollments } = await supabaseAdmin
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed");

    const total = totalEnrollments || 0;
    const completed = completedEnrollments || 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Per-course stats
    const { data: courses } = await supabaseAdmin
      .from("courses")
      .select("id, title, code")
      .order("sort_order", { ascending: true });

    const courseStats = [];

    for (const course of courses || []) {
      const { count: enrolledCount } = await supabaseAdmin
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .eq("course_id", course.id);

      const { count: completedCount } = await supabaseAdmin
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .eq("course_id", course.id)
        .eq("status", "completed");

      // Avg quiz score for this course: get quiz IDs via modules -> lessons -> quizzes
      const { data: modules } = await supabaseAdmin
        .from("modules")
        .select("id")
        .eq("course_id", course.id);

      let avgScore: number | null = null;

      if (modules && modules.length > 0) {
        const moduleIds = modules.map((m: { id: string }) => m.id);

        const { data: lessons } = await supabaseAdmin
          .from("lessons")
          .select("id")
          .in("module_id", moduleIds)
          .eq("lesson_type", "quiz");

        if (lessons && lessons.length > 0) {
          const lessonIds = lessons.map((l: { id: string }) => l.id);

          const { data: quizzes } = await supabaseAdmin
            .from("quizzes")
            .select("id")
            .in("lesson_id", lessonIds);

          if (quizzes && quizzes.length > 0) {
            const quizIds = quizzes.map((q: { id: string }) => q.id);

            const { data: attempts } = await supabaseAdmin
              .from("quiz_attempts")
              .select("score_pct")
              .in("quiz_id", quizIds);

            if (attempts && attempts.length > 0) {
              const sum = attempts.reduce(
                (acc: number, a: { score_pct: number }) => acc + a.score_pct,
                0
              );
              avgScore = Math.round(sum / attempts.length);
            }
          }
        }
      }

      courseStats.push({
        id: course.id,
        title: course.title,
        code: course.code,
        enrolled_count: enrolledCount || 0,
        completed_count: completedCount || 0,
        avg_score: avgScore,
      });
    }

    return NextResponse.json({
      total_users: totalUsers || 0,
      total_enrollments: total,
      completed_enrollments: completed,
      completion_rate: completionRate,
      courses: courseStats,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
