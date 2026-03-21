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

// POST — create module
export async function POST(req: NextRequest) {
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { course_id, title, description, sort_order } = body;

    if (!course_id || !title) {
      return NextResponse.json({ error: "course_id and title are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("modules")
      .insert({
        course_id,
        title,
        description: description || null,
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

// PATCH — update module
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
      .from("modules")
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

// DELETE — delete module (CASCADE handles lessons)
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
      .from("modules")
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
