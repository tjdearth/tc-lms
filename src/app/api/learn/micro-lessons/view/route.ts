import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

// POST — log a micro-lesson view event
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email || null;

    const body = await req.json();
    const { micro_lesson_id } = body;

    if (!micro_lesson_id || typeof micro_lesson_id !== "string") {
      return NextResponse.json({ error: "micro_lesson_id is required" }, { status: 400 });
    }

    // Look up the user's brand so we can slice views by brand in analytics
    let user_brand: string | null = null;
    if (email) {
      const { data: userRow } = await supabaseAdmin
        .from("lms_users")
        .select("brand")
        .eq("email", email)
        .maybeSingle();
      user_brand = userRow?.brand || null;
    }

    const { error } = await supabaseAdmin.from("micro_lesson_views").insert({
      micro_lesson_id,
      user_email: email,
      user_brand,
    });

    if (error) {
      console.error("Micro-lesson view insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
