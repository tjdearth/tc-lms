import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import { getGmBrand } from "@/lib/admin-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET — admin stats dashboard (optimized: 4 queries instead of 40+)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    // Allow global course creators OR GMs
    const isGlobalCreator = isCourseCreator(email);
    const gmBrand = !isGlobalCreator ? await getGmBrand(email) : null;
    if (!isGlobalCreator && !gmBrand) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Run all independent queries in parallel
    const [usersResult, allEnrollments, coursesResult] = await Promise.all([
      supabaseAdmin
        .from("lms_users")
        .select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("enrollments")
        .select("course_id, status"),
      supabaseAdmin
        .from("courses")
        .select("id, title, code, category, is_published, brand")
        .order("sort_order", { ascending: true }),
    ]);

    const totalUsers = usersResult.count || 0;
    const enrollments = allEnrollments.data || [];
    const courses = coursesResult.data || [];

    const totalEnrollments = enrollments.length;
    const completedEnrollments = enrollments.filter(
      (e: { status: string }) => e.status === "completed"
    ).length;
    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0;

    // Build per-course stats from the single enrollments query
    const enrolledByCourse: Record<string, number> = {};
    const completedByCourse: Record<string, number> = {};

    for (const e of enrollments) {
      const cid = (e as { course_id: string }).course_id;
      enrolledByCourse[cid] = (enrolledByCourse[cid] || 0) + 1;
      if ((e as { status: string }).status === "completed") {
        completedByCourse[cid] = (completedByCourse[cid] || 0) + 1;
      }
    }

    const courseStats = courses.map(
      (c: {
        id: string;
        title: string;
        code: string;
        category: string;
        is_published: boolean;
        brand: string;
      }) => ({
        id: c.id,
        title: c.title,
        code: c.code,
        category: c.category,
        is_published: c.is_published,
        brand: c.brand || "tc",
        enrolled_count: enrolledByCourse[c.id] || 0,
        completed_count: completedByCourse[c.id] || 0,
        avg_score: null,
      })
    );

    return NextResponse.json({
      total_users: totalUsers,
      total_enrollments: totalEnrollments,
      completed_enrollments: completedEnrollments,
      completion_rate: completionRate,
      courses: courseStats,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
