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

// POST — create lesson
export async function POST(req: NextRequest) {
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { module_id, title, lesson_type, html_content, wiki_node_id, video_url, estimated_minutes, sort_order } = body;

    if (!module_id || !title || !lesson_type) {
      return NextResponse.json({ error: "module_id, title, and lesson_type are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("lessons")
      .insert({
        module_id,
        title,
        lesson_type,
        html_content: html_content || null,
        wiki_node_id: wiki_node_id || null,
        video_url: video_url || null,
        estimated_minutes: estimated_minutes || 0,
        sort_order: sort_order || 0,
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

// PATCH — update lesson
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
      .from("lessons")
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

// DELETE — delete lesson (CASCADE handles quizzes)
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
      .from("lessons")
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
