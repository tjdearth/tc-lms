import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireCourseCreator() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isCourseCreator(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
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

    let query = supabaseAdmin
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });

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

    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — create course
export async function POST(req: NextRequest) {
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { code, title, description, thumbnail_url, category, tracks, estimated_minutes, is_published, is_sequential, completion_rule, min_score_pct, sort_order } = body;

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
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
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
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

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
