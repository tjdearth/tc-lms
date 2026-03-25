import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdmin } from "@/lib/admin";
import { brandFromEmail } from "@/lib/brands";

/**
 * Permission helper: user can manage events for a brand if they are
 * a global admin OR their email domain maps to that brand.
 */
function canManageBrand(email: string, brand: string): boolean {
  if (isAdmin(email)) return true;
  const userBrand = brandFromEmail(email);
  return userBrand === brand;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Support both single event { event: {...} } and batch { events: [...] }
    const isSingle = body.event && !body.events;
    const eventList: Record<string, unknown>[] = isSingle ? [body.event] : body.events;

    if (!Array.isArray(eventList) || eventList.length === 0) {
      return NextResponse.json({ error: "Event data required" }, { status: 400 });
    }

    // Permission check: ensure user can manage each brand in the payload
    for (const e of eventList) {
      const brand = e.brand as string;
      if (brand && !canManageBrand(session.user.email, brand)) {
        return NextResponse.json(
          { error: `You do not have permission to add events for ${brand}` },
          { status: 403 }
        );
      }
    }

    const rows = eventList.map((e: Record<string, unknown>) => ({
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Event id required" }, { status: 400 });
    }

    // Fetch the existing event to check brand ownership
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("calendar_events")
      .select("brand")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!canManageBrand(session.user.email, existing.brand)) {
      return NextResponse.json(
        { error: "You do not have permission to edit this event" },
        { status: 403 }
      );
    }

    // Build the update payload — only allow safe fields
    const allowed: Record<string, unknown> = {};
    if (updates.title !== undefined) allowed.title = updates.title;
    if (updates.description !== undefined) allowed.description = updates.description || null;
    if (updates.date_start !== undefined) allowed.date_start = updates.date_start;
    if (updates.date_end !== undefined) allowed.date_end = updates.date_end || null;
    if (updates.event_type !== undefined) allowed.event_type = updates.event_type;
    if (updates.impact_notes !== undefined) allowed.impact_notes = updates.impact_notes || null;
    if (updates.country !== undefined) allowed.country = updates.country || null;
    if (updates.brand !== undefined) {
      // If changing brand, user must also have permission for new brand
      if (!canManageBrand(session.user.email, updates.brand)) {
        return NextResponse.json(
          { error: `You do not have permission to move events to ${updates.brand}` },
          { status: 403 }
        );
      }
      allowed.brand = updates.brand;
    }

    const { data, error } = await supabaseAdmin
      .from("calendar_events")
      .update(allowed)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data });
  } catch (e: unknown) {
    console.error("Calendar events PATCH error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Event id required" }, { status: 400 });
    }

    // Fetch the existing event to check brand ownership
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("calendar_events")
      .select("brand")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!canManageBrand(session.user.email, existing.brand)) {
      return NextResponse.json(
        { error: "You do not have permission to delete this event" },
        { status: 403 }
      );
    }

    const { error } = await supabaseAdmin
      .from("calendar_events")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (e: unknown) {
    console.error("Calendar events DELETE error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
