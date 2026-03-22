import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { events } = await req.json();
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "Events array required" }, { status: 400 });
    }

    const rows = events.map((e: Record<string, unknown>) => ({
      brand: e.brand,
      title: e.title,
      description: e.description || null,
      date_start: e.date_start,
      date_end: e.date_end || null,
      event_type: e.event_type || "custom",
      impact_notes: e.impact_notes || null,
      country: e.country || null,
      recurring: false,
    }));

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .insert(rows)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ added: data?.length || 0, events: data });
  } catch (e: unknown) {
    console.error("Calendar events POST error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
