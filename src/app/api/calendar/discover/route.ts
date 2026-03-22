import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Anthropic from "@anthropic-ai/sdk";
import { DMC_BRANDS } from "@/lib/brands";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { brand, year } = await req.json();
    if (!brand || !DMC_BRANDS[brand]) {
      return NextResponse.json({ error: "Valid brand required" }, { status: 400 });
    }

    const searchYear = year || new Date().getFullYear();
    const countries = DMC_BRANDS[brand].countries.join(", ");

    // Fetch existing events for this brand to avoid duplicates
    const { data: existingEvents } = await supabaseAdmin
      .from("calendar_events")
      .select("title, date_start")
      .eq("brand", brand)
      .gte("date_start", `${searchYear}-01-01`)
      .lte("date_start", `${searchYear}-12-31`);

    const existingTitles = (existingEvents || []).map((e) => e.title.toLowerCase());

    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are a travel industry research assistant. Your job is to find festivals, public holidays, cultural events, peak/low travel seasons, and other travel-impacting events for specific countries.

Return ONLY a JSON array of event objects. Each object must have:
- "title": Event name (string)
- "date_start": Start date YYYY-MM-DD (string)
- "date_end": End date YYYY-MM-DD or null if single day (string | null)
- "event_type": One of "public_holiday", "festival", "peak_season", "low_season", "custom" (string)
- "description": 1-2 sentence description of the event and its relevance to travel (string)
- "impact_notes": Brief note on how this impacts travel operations — bookings, pricing, availability, closures (string)
- "country": The specific country (string)

Guidelines:
- Include 15-25 events covering the full year
- Mix of public holidays, cultural festivals, peak/low seasons, and major events
- Focus on events that IMPACT TRAVEL: hotel pricing, flight demand, site closures, visa changes, weather seasons
- Use accurate dates for ${searchYear}
- For multi-day events (festivals, seasons), always include date_end
- Do NOT include events that are already in our calendar: ${existingTitles.join(", ")}

Return ONLY the JSON array, no markdown fencing, no explanation.`,
      messages: [
        {
          role: "user",
          content: `Find key travel-impacting events, holidays, festivals, and seasons in ${countries} for ${searchYear}. Focus on events that a DMC (Destination Management Company) team needs to plan around.`,
        },
      ],
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    // Parse JSON — handle possible markdown fencing
    let events;
    try {
      const cleaned = text.replace(/```json?\s*/g, "").replace(/```\s*/g, "").trim();
      events = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
    }

    // Validate and clean events
    const validTypes = ["public_holiday", "festival", "peak_season", "low_season", "office_closure", "custom"];
    const cleanedEvents = events
      .filter((e: Record<string, unknown>) => e.title && e.date_start && e.event_type)
      .filter((e: Record<string, unknown>) => !existingTitles.includes((e.title as string).toLowerCase()))
      .map((e: Record<string, unknown>) => ({
        title: e.title as string,
        date_start: e.date_start as string,
        date_end: (e.date_end as string) || null,
        event_type: validTypes.includes(e.event_type as string) ? e.event_type : "custom",
        description: (e.description as string) || null,
        impact_notes: (e.impact_notes as string) || null,
        country: (e.country as string) || DMC_BRANDS[brand].countries[0],
        brand,
      }));

    return NextResponse.json({ events: cleanedEvents, brand, year: searchYear });
  } catch (e: unknown) {
    console.error("Calendar discover error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
