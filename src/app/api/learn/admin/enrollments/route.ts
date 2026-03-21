import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET — list enrollments for a course (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("course_id");

    if (!courseId) {
      return NextResponse.json({ error: "course_id is required" }, { status: 400 });
    }

    // Get enrollments with user info
    const { data: enrollments, error } = await supabaseAdmin
      .from("enrollments")
      .select("*")
      .eq("course_id", courseId)
      .order("enrolled_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json([]);
    }

    // Get user details
    const userIds = enrollments.map((e) => e.user_id);
    const { data: users } = await supabaseAdmin
      .from("lms_users")
      .select("id, email, name")
      .in("id", userIds);

    const userMap = new Map(
      (users || []).map((u: { id: string; email: string; name: string | null }) => [u.id, u])
    );

    // Get lesson counts for progress calculation
    const { data: modules } = await supabaseAdmin
      .from("modules")
      .select("id")
      .eq("course_id", courseId);

    const moduleIds = (modules || []).map((m: { id: string }) => m.id);
    let totalLessons = 0;
    if (moduleIds.length > 0) {
      const { count } = await supabaseAdmin
        .from("lessons")
        .select("id", { count: "exact", head: true })
        .in("module_id", moduleIds);
      totalLessons = count || 0;
    }

    // Get lesson progress per user
    let lessonIds: string[] = [];
    if (moduleIds.length > 0) {
      const { data: lessons } = await supabaseAdmin
        .from("lessons")
        .select("id")
        .in("module_id", moduleIds);
      lessonIds = (lessons || []).map((l: { id: string }) => l.id);
    }

    let progressByUser = new Map<string, number>();
    if (lessonIds.length > 0) {
      const { data: progress } = await supabaseAdmin
        .from("lesson_progress")
        .select("user_id, status")
        .in("lesson_id", lessonIds)
        .eq("status", "completed");

      const counts = new Map<string, number>();
      for (const p of progress || []) {
        counts.set(p.user_id, (counts.get(p.user_id) || 0) + 1);
      }
      progressByUser = counts;
    }

    // Assemble response
    const result = enrollments.map((e) => {
      const user = userMap.get(e.user_id);
      const completedLessons = progressByUser.get(e.user_id) || 0;
      return {
        id: e.id,
        user_email: user?.email || "unknown",
        user_name: user?.name || null,
        status: e.status,
        enrolled_at: e.enrolled_at,
        due_date: e.due_date,
        completed_at: e.completed_at,
        progress_pct: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      };
    });

    return NextResponse.json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH — update enrollment (due date, manual completion)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, due_date, status } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (due_date !== undefined) updates.due_date = due_date;
    if (status === "completed") {
      updates.status = "completed";
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
