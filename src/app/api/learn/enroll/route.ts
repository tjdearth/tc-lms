import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET — list current user's enrollments
export async function GET() {
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

    const { data: enrollments, error } = await supabaseAdmin
      .from("enrollments")
      .select("*")
      .eq("user_id", lmsUser.id)
      .order("enrolled_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(enrollments || []);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — enroll current user in a course
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const body = await req.json();
    const { course_id, due_date } = body;

    if (!course_id) {
      return NextResponse.json({ error: "course_id is required" }, { status: 400 });
    }

    // Get LMS user
    const { data: lmsUser, error: userErr } = await supabaseAdmin
      .from("lms_users")
      .select("id")
      .eq("email", email)
      .single();

    if (userErr || !lmsUser) {
      return NextResponse.json({ error: "LMS user not found. Please complete onboarding first." }, { status: 400 });
    }

    // Check prerequisites
    const { data: prereqs } = await supabaseAdmin
      .from("course_prerequisites")
      .select("prerequisite_id")
      .eq("course_id", course_id);

    if (prereqs && prereqs.length > 0) {
      const prereqIds = prereqs.map((p: { prerequisite_id: string }) => p.prerequisite_id);

      const { data: completedEnrollments } = await supabaseAdmin
        .from("enrollments")
        .select("course_id")
        .eq("user_id", lmsUser.id)
        .eq("status", "completed")
        .in("course_id", prereqIds);

      const completedIds = new Set(
        (completedEnrollments || []).map((e: { course_id: string }) => e.course_id)
      );

      const missing = prereqIds.filter((id: string) => !completedIds.has(id));

      if (missing.length > 0) {
        // Fetch missing course titles for a helpful error
        const { data: missingCourses } = await supabaseAdmin
          .from("courses")
          .select("id, title")
          .in("id", missing);

        return NextResponse.json({
          error: "Prerequisites not met",
          missing_courses: missingCourses || missing.map((id: string) => ({ id, title: id })),
        }, { status: 400 });
      }
    }

    // Insert enrollment
    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .insert({
        user_id: lmsUser.id,
        course_id,
        due_date: due_date || null,
        status: "enrolled",
      })
      .select()
      .single();

    if (error) {
      // Handle unique violation (already enrolled)
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — unenroll (only if status is 'enrolled')
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const body = await req.json();
    const { course_id } = body;

    if (!course_id) {
      return NextResponse.json({ error: "course_id is required" }, { status: 400 });
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

    // Check current enrollment status
    const { data: enrollment } = await supabaseAdmin
      .from("enrollments")
      .select("id, status")
      .eq("user_id", lmsUser.id)
      .eq("course_id", course_id)
      .single();

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 404 });
    }

    if (enrollment.status !== "enrolled") {
      return NextResponse.json({ error: "Cannot unenroll from a course that is in progress or completed" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("enrollments")
      .delete()
      .eq("id", enrollment.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
