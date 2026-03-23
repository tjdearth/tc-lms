import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { BRAND_NAMES } from "@/lib/brands";

const FEED_TOKEN = process.env.CALENDAR_FEED_TOKEN || "tc-cal-2026";

function escIcs(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function toIcsDate(d: string): string {
  return d.replace(/-/g, "");
}

function dayAfter(d: string): string {
  const date = new Date(d + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

export async function GET(
  req: NextRequest,
  { params }: { params: { brand: string } }
) {
  // Verify token
  const token = req.nextUrl.searchParams.get("token");
  if (token !== FEED_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  // Decode brand slug back to name
  const brandSlug = decodeURIComponent(params.brand).toLowerCase();
  let brandName: string | null = null;

  if (brandSlug === "all") {
    brandName = "all";
  } else {
    brandName = BRAND_NAMES.find(
      (b) => b.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and") === brandSlug
    ) || null;

    if (!brandName) {
      // Try partial match
      brandName = BRAND_NAMES.find(
        (b) => b.toLowerCase().replace(/\s+/g, "-") === brandSlug
      ) || null;
    }
  }

  if (!brandName) {
    return NextResponse.json(
      { error: "Brand not found", available: BRAND_NAMES },
      { status: 404 }
    );
  }

  // Fetch events
  let query = supabaseAdmin
    .from("calendar_events")
    .select("*")
    .order("date_start", { ascending: true });

  if (brandName !== "all") {
    query = query.eq("brand", brandName);
  }

  const { data: events, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build .ics
  const calName = brandName === "all" ? "Travel Collection — All Events" : `${brandName} Events`;
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Travel Collection//Atlas Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${calName}`,
    "X-WR-TIMEZONE:UTC",
  ];

  for (const ev of events || []) {
    const uid = `${ev.id}@atlas.travelcollection.com`;
    const dtStart = toIcsDate(ev.date_start);
    const endDate = ev.date_end || ev.date_start;
    const dtEnd = dayAfter(endDate);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`);
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    lines.push(`SUMMARY:${escIcs(ev.title)}`);
    if (ev.description) lines.push(`DESCRIPTION:${escIcs(ev.description)}`);
    if (ev.impact_notes) {
      const desc = ev.description
        ? `${escIcs(ev.description)}\\n\\nImpact: ${escIcs(ev.impact_notes)}`
        : `Impact: ${escIcs(ev.impact_notes)}`;
      // Replace the description line if we already added one
      if (ev.description) {
        lines[lines.length - 1] = `DESCRIPTION:${desc}`;
      } else {
        lines.push(`DESCRIPTION:${desc}`);
      }
    }
    if (ev.country) lines.push(`LOCATION:${escIcs(ev.country)}`);
    lines.push(`CATEGORIES:${escIcs(ev.brand)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="${brandSlug}-events.ics"`,
      "Cache-Control": "public, max-age=3600", // Cache 1 hour
    },
  });
}
