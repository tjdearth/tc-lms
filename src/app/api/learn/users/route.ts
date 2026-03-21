import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { brandFromEmail } from "@/lib/brands";

// GET — get or create LMS user for current session
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();

    // Check if user already exists
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("lms_users")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(existing);
    }

    // Not found — create new user
    if (fetchErr && fetchErr.code !== "PGRST116") {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const brand = brandFromEmail(email);

    const { data, error } = await supabaseAdmin
      .from("lms_users")
      .insert({
        email,
        name: session.user.name || null,
        image_url: session.user.image || null,
        brand,
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

// PATCH — update own user profile (track, brand, onboarded_at)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const body = await req.json();
    const { track, brand, onboarded_at } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (track !== undefined) updates.track = track;
    if (brand !== undefined) updates.brand = brand;
    if (onboarded_at !== undefined) updates.onboarded_at = onboarded_at;

    const { data, error } = await supabaseAdmin
      .from("lms_users")
      .update(updates)
      .eq("email", email)
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
