import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brand = req.nextUrl.searchParams.get("brand");
    if (!brand) {
      return NextResponse.json({ error: "brand parameter required" }, { status: 400 });
    }

    // Fetch all data in parallel
    const [usersResult, enrollmentsResult, coursesResult, quizResult] = await Promise.all([
      supabaseAdmin.from("lms_users").select("id, email, name, brand").eq("brand", brand),
      supabaseAdmin.from("enrollments").select("id, user_id, course_id, status, due_date, enrolled_at, completed_at"),
      supabaseAdmin.from("courses").select("id, title, code, is_published").eq("is_published", true).order("title"),
      supabaseAdmin.from("quiz_attempts").select("user_id, quiz_id, score_pct, passed"),
    ]);

    const users = usersResult.data || [];
    const allEnrollments = enrollmentsResult.data || [];
    const courses = coursesResult.data || [];
    const quizAttempts = quizResult.data || [];

    const userIds = new Set(users.map((u) => u.id));
    const courseMap = new Map(courses.map((c) => [c.id, c]));

    // Filter enrollments to this DMC's users and published courses
    const enrollments = allEnrollments.filter(
      (e) => userIds.has(e.user_id) && courseMap.has(e.course_id)
    );

    // Stats
    const totalMembers = users.length;
    const inProgress = enrollments.filter((e) => e.status === "in_progress" || e.status === "enrolled").length;
    const completed = enrollments.filter((e) => e.status === "completed").length;

    // Avg quiz score for this DMC's users
    const dmcQuizAttempts = quizAttempts.filter((q) => userIds.has(q.user_id));
    const avgQuizScore = dmcQuizAttempts.length > 0
      ? Math.round(dmcQuizAttempts.reduce((sum, q) => sum + (q.score_pct || 0), 0) / dmcQuizAttempts.length)
      : null;

    // Team members detail
    const now = new Date().toISOString().slice(0, 10);
    const teamMembers = users.map((user) => {
      const userEnrollments = enrollments.filter((e) => e.user_id === user.id);
      const enrolledCount = userEnrollments.length;
      const completedCount = userEnrollments.filter((e) => e.status === "completed").length;
      const overdueCount = userEnrollments.filter(
        (e) => e.due_date && e.due_date < now && e.status !== "completed"
      ).length;

      const userQuizScores = dmcQuizAttempts.filter((q) => q.user_id === user.id);
      const userAvgScore = userQuizScores.length > 0
        ? Math.round(userQuizScores.reduce((s, q) => s + (q.score_pct || 0), 0) / userQuizScores.length)
        : null;

      return {
        id: user.id,
        name: user.name || user.email.split("@")[0],
        email: user.email,
        enrolled: enrolledCount,
        completed: completedCount,
        avg_quiz_score: userAvgScore,
        overdue: overdueCount,
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    // Course completion rates
    const courseCompletion = courses.map((course) => {
      const courseEnrollments = enrollments.filter((e) => e.course_id === course.id);
      const enrolledCount = courseEnrollments.length;
      const completedCount = courseEnrollments.filter((e) => e.status === "completed").length;
      return {
        id: course.id,
        title: course.title,
        code: course.code,
        enrolled: enrolledCount,
        completed: completedCount,
        completion_pct: enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0,
      };
    }).filter((c) => c.enrolled > 0).sort((a, b) => b.enrolled - a.enrolled);

    // Overdue alerts
    const overdueAlerts = enrollments
      .filter((e) => e.due_date && e.due_date < now && e.status !== "completed")
      .map((e) => {
        const user = users.find((u) => u.id === e.user_id);
        const course = courseMap.get(e.course_id);
        const daysOverdue = Math.ceil(
          (new Date().getTime() - new Date(e.due_date!).getTime()) / (1000 * 60 * 60 * 24)
        );
        return {
          user_name: user?.name || user?.email?.split("@")[0] || "Unknown",
          user_email: user?.email || "",
          course_title: course?.title || "Unknown",
          due_date: e.due_date,
          days_overdue: daysOverdue,
        };
      })
      .sort((a, b) => b.days_overdue - a.days_overdue);

    return NextResponse.json({
      stats: {
        total_members: totalMembers,
        in_progress: inProgress,
        completed,
        avg_quiz_score: avgQuizScore,
      },
      team_members: teamMembers,
      course_completion: courseCompletion,
      overdue_alerts: overdueAlerts,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
