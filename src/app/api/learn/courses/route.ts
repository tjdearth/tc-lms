import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import { isCourseCreatorForBrand } from "@/lib/admin-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function requireCourseCreator() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isCourseCreator(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
}

async function requireCourseCreatorForBrand(brand?: string): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  // Global course creators can edit any brand
  if (isCourseCreator(email)) return null;
  // GMs can create/edit for their own brand
  if (brand) {
    const allowed = await isCourseCreatorForBrand(email, brand);
    if (allowed) return null;
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}

// GET — list courses with optional filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const track = searchParams.get("track");
    const published = searchParams.get("published");
    const brand = searchParams.get("brand");

    let query = supabaseAdmin
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });

    if (brand) {
      query = query.eq("brand", brand);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (track) {
      query = query.contains("tracks", [track]);
    }
    if (published !== null) {
      query = query.eq("is_published", published === "true");
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Compute progress_pct per course for the current user
    const email = session.user.email.toLowerCase();
    const { data: lmsUser } = await supabaseAdmin
      .from("lms_users")
      .select("id")
      .eq("email", email)
      .single();

    if (lmsUser && data && data.length > 0) {
      // Get all lessons grouped by course (via modules)
      const courseIds = data.map((c: { id: string }) => c.id);
      const { data: modules } = await supabaseAdmin
        .from("modules")
        .select("id, course_id")
        .in("course_id", courseIds);

      if (modules && modules.length > 0) {
        const moduleIds = modules.map((m: { id: string }) => m.id);
        const { data: lessons } = await supabaseAdmin
          .from("lessons")
          .select("id, module_id")
          .in("module_id", moduleIds);

        const { data: progress } = await supabaseAdmin
          .from("lesson_progress")
          .select("lesson_id, status")
          .eq("user_id", lmsUser.id);

        if (lessons) {
          // Build: courseId -> lessonIds
          const moduleToCoure = new Map(modules.map((m: { id: string; course_id: string }) => [m.id, m.course_id]));
          const courseLessons: Record<string, string[]> = {};
          for (const l of lessons) {
            const cid = moduleToCoure.get(l.module_id);
            if (cid) {
              if (!courseLessons[cid]) courseLessons[cid] = [];
              courseLessons[cid].push(l.id);
            }
          }

          const completedSet = new Set(
            (progress || []).filter((p: { status: string }) => p.status === "completed").map((p: { lesson_id: string }) => p.lesson_id)
          );

          for (const course of data) {
            const cLessons = courseLessons[(course as { id: string }).id] || [];
            if (cLessons.length > 0) {
              const done = cLessons.filter((lid) => completedSet.has(lid)).length;
              (course as { progress_pct?: number }).progress_pct = Math.round((done / cLessons.length) * 100);
            } else {
              (course as { progress_pct?: number }).progress_pct = 0;
            }
          }
        }
      }
    }

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — create course
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { code, title, description, thumbnail_url, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, min_score_pct, sort_order, brand } = body;

    const courseBrand = brand || "tc";
    const denied = await requireCourseCreatorForBrand(courseBrand);
    if (denied) return denied;

    if (!code || !title) {
      return NextResponse.json({ error: "code and title are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("courses")
      .insert({
        code,
        title,
        description: description || null,
        thumbnail_url: thumbnail_url || null,
        category: category || "general",
        tracks: tracks || ["general"],
        estimated_minutes: estimated_minutes || 0,
        is_published: is_published ?? false,
        is_sequential: is_sequential ?? true,
        completion_rule: completion_rule || "all_lessons",
        min_score_pct: min_score_pct || null,
        sort_order: sort_order || 0,
        brand: courseBrand,
        created_by: session!.user!.email,
      })
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

// PATCH — update course
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, _update_prerequisites, prerequisite_ids, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Look up the course's brand for GM auth check
    const { data: existingCourse } = await supabaseAdmin
      .from("courses")
      .select("brand")
      .eq("id", id)
      .single();
    const courseBrand = existingCourse?.brand || "tc";
    const denied = await requireCourseCreatorForBrand(courseBrand);
    if (denied) return denied;

    // Handle prerequisite updates
    if (_update_prerequisites && Array.isArray(prerequisite_ids)) {
      // Delete existing prerequisites
      await supabaseAdmin
        .from("course_prerequisites")
        .delete()
        .eq("course_id", id);

      // Insert new prerequisites
      if (prerequisite_ids.length > 0) {
        const rows = prerequisite_ids.map((prereqId: string) => ({
          course_id: id,
          prerequisite_id: prereqId,
        }));
        await supabaseAdmin.from("course_prerequisites").insert(rows);
      }

      return NextResponse.json({ success: true });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("courses")
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

// DELETE — delete course
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Look up the course's brand for GM auth check
    const { data: existingCourse } = await supabaseAdmin
      .from("courses")
      .select("brand")
      .eq("id", id)
      .single();
    const courseBrand = existingCourse?.brand || "tc";
    const denied = await requireCourseCreatorForBrand(courseBrand);
    if (denied) return denied;

    const { error } = await supabaseAdmin
      .from("courses")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
