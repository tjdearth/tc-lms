import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator, isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userIsAdmin = isAdmin(session.user.email);

    const [usersResult, enrollmentsResult, coursesResult, quizResult] = await Promise.all([
      supabaseAdmin.from("lms_users").select("id, email, name, brand"),
      supabaseAdmin.from("enrollments").select("id, user_id, course_id, status, due_date, enrolled_at, completed_at"),
      supabaseAdmin.from("courses").select("id, title, code, is_published").order("title"),
      supabaseAdmin.from("quiz_attempts").select("score_pct"),
    ]);

    const users = usersResult.data || [];
    const enrollments = enrollmentsResult.data || [];
    const courses = coursesResult.data || [];
    const quizAttempts = quizResult.data || [];

    // Overview
    const totalUsers = users.length;
    const totalEnrollments = enrollments.length;
    const completedCount = enrollments.filter((e) => e.status === "completed").length;
    const completionRate = totalEnrollments > 0 ? Math.round((completedCount / totalEnrollments) * 100) : 0;
    const avgQuizScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, q) => sum + (q.score_pct || 0), 0) / quizAttempts.length)
      : null;

    // Course performance
    const enrolledByCourse: Record<string, number> = {};
    const completedByCourse: Record<string, number> = {};
    for (const e of enrollments) {
      enrolledByCourse[e.course_id] = (enrolledByCourse[e.course_id] || 0) + 1;
      if (e.status === "completed") {
        completedByCourse[e.course_id] = (completedByCourse[e.course_id] || 0) + 1;
      }
    }
    const courseStats = courses.map((c) => {
      const enrolled = enrolledByCourse[c.id] || 0;
      const completed = completedByCourse[c.id] || 0;
      return {
        id: c.id,
        title: c.title,
        code: c.code,
        enrolled,
        completed,
        completion_pct: enrolled > 0 ? Math.round((completed / enrolled) * 100) : 0,
      };
    });

    // Overdue learners
    const now = new Date().toISOString().slice(0, 10);
    const userMap = new Map(users.map((u) => [u.id, u]));
    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const overdue = enrollments
      .filter((e) => e.due_date && e.due_date < now && e.status !== "completed")
      .map((e) => {
        const user = userMap.get(e.user_id);
        const course = courseMap.get(e.course_id);
        return {
          user_name: user?.name || user?.email || "Unknown",
          user_email: user?.email || "",
          user_brand: user?.brand || "Unknown",
          course_title: course?.title || "Unknown",
          due_date: e.due_date,
        };
      })
      .sort((a, b) => a.due_date.localeCompare(b.due_date));

    // Brand breakdown
    const brandStats: Record<string, { enrolled: number; completed: number }> = {};
    for (const e of enrollments) {
      const user = userMap.get(e.user_id);
      const brand = user?.brand || "Unknown";
      if (!brandStats[brand]) brandStats[brand] = { enrolled: 0, completed: 0 };
      brandStats[brand].enrolled += 1;
      if (e.status === "completed") brandStats[brand].completed += 1;
    }
    const brandBreakdown = Object.entries(brandStats)
      .map(([brand, stats]) => ({ brand, ...stats }))
      .sort((a, b) => b.enrolled - a.enrolled);

    // KB Health stats (admin only) — estimate context size for Atlas AI
    let kb_health = null;
    if (userIsAdmin) {
      const [wikiCount, lessonsFull, microCount, quizQCount] = await Promise.all([
        supabaseAdmin.from("wiki_nodes").select("id, html_content", { count: "exact" }).eq("is_published", true).eq("node_type", "article"),
        supabaseAdmin.from("lessons").select("id, html_content, transcript").limit(500),
        supabaseAdmin.from("micro_lessons").select("id, transcript, key_points_html", { count: "exact" }).eq("is_published", true),
        supabaseAdmin.from("quiz_questions").select("id", { count: "exact" }),
      ]);

      const wikiArticles = wikiCount.data || [];
      const allLessons = lessonsFull.data || [];
      const microLessons = microCount.data || [];

      // Count lessons with actual transcript content
      const lessonsWithTranscripts = allLessons.filter((l) => l.transcript && stripHtml(l.transcript).length > 50).length;
      const lessonsWithContent = allLessons.filter((l) => l.html_content && stripHtml(l.html_content).length > 50).length;
      const microWithTranscripts = microLessons.filter((l) => l.transcript && stripHtml(l.transcript).length > 50).length;

      // Estimate total context chars (mirrors what /api/ask builds)
      let estChars = 0;
      for (const l of allLessons) {
        if (l.html_content) estChars += Math.min(stripHtml(l.html_content).length, 1500);
        if (l.transcript) estChars += Math.min(stripHtml(l.transcript).length, 2000);
      }
      for (const a of wikiArticles) {
        if (a.html_content) estChars += Math.min(stripHtml(a.html_content).length, 500);
      }
      for (const m of microLessons) {
        if (m.transcript) estChars += Math.min(stripHtml(m.transcript).length, 1500);
        if (m.key_points_html) estChars += Math.min(stripHtml(m.key_points_html).length, 1000);
      }

      const contextLimit = 80000;

      kb_health = {
        wiki_articles: wikiCount.count || 0,
        course_lessons: allLessons.length,
        lessons_with_content: lessonsWithContent,
        lessons_with_transcripts: lessonsWithTranscripts,
        micro_lessons: microCount.count || 0,
        micro_with_transcripts: microWithTranscripts,
        quiz_questions: quizQCount.count || 0,
        estimated_context_chars: estChars,
        context_limit: contextLimit,
        usage_pct: Math.round((estChars / contextLimit) * 100),
      };
    }

    return NextResponse.json({
      overview: {
        total_users: totalUsers,
        total_enrollments: totalEnrollments,
        completed: completedCount,
        completion_rate: completionRate,
        avg_quiz_score: avgQuizScore,
      },
      courses: courseStats,
      overdue,
      brand_breakdown: brandBreakdown,
      ...(kb_health ? { kb_health } : {}),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
