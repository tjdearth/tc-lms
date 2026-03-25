import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

// POST — log a search event or feedback
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email || null;

    const body = await req.json();
    const { query, source, results_count, clicked_result_id, feedback, message_id } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("search_logs").insert({
      query: query.trim().toLowerCase(),
      user_email: email,
      source: source || null,
      results_count: results_count ?? 0,
      clicked_result_id: clicked_result_id || null,
      feedback: feedback || null,
      message_id: message_id || null,
    });

    if (error) {
      console.error("Search log insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — search analytics (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Top 20 searched terms (with source info)
    const { data: topQueries } = await supabaseAdmin
      .from("search_logs")
      .select("query, source")
      .order("created_at", { ascending: false })
      .limit(5000);

    const queryCounts: Record<string, { count: number; source: string }> = {};
    for (const row of topQueries || []) {
      if (!queryCounts[row.query]) {
        queryCounts[row.query] = { count: 0, source: row.source || "wiki_search" };
      }
      queryCounts[row.query].count += 1;
      // Keep the most recent source
      if (row.source) queryCounts[row.query].source = row.source;
    }
    const topSearches = Object.entries(queryCounts)
      .map(([query, { count, source }]) => ({ query, count, source }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Queries with 0 results
    const { data: zeroResults } = await supabaseAdmin
      .from("search_logs")
      .select("query")
      .eq("results_count", 0)
      .order("created_at", { ascending: false })
      .limit(2000);

    const zeroCounts: Record<string, number> = {};
    for (const row of zeroResults || []) {
      zeroCounts[row.query] = (zeroCounts[row.query] || 0) + 1;
    }
    const noResultsQueries = Object.entries(zeroCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // Search volume: this week and this month
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { count: weekCount } = await supabaseAdmin
      .from("search_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", weekAgo);

    const { count: monthCount } = await supabaseAdmin
      .from("search_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthAgo);

    // Feedback stats
    const { data: feedbackRows } = await supabaseAdmin
      .from("search_logs")
      .select("query, feedback")
      .not("feedback", "is", null)
      .order("created_at", { ascending: false })
      .limit(5000);

    let totalPositive = 0;
    let totalNegative = 0;
    const negativeCounts: Record<string, number> = {};

    for (const row of feedbackRows || []) {
      if (row.feedback === "positive") totalPositive++;
      if (row.feedback === "negative") {
        totalNegative++;
        negativeCounts[row.query] = (negativeCounts[row.query] || 0) + 1;
      }
    }

    const totalRated = totalPositive + totalNegative;
    const helpfulnessRate = totalRated > 0 ? Math.round((totalPositive / totalRated) * 100) : null;

    const negativeQueries = Object.entries(negativeCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return NextResponse.json({
      top_searches: topSearches,
      no_results_queries: noResultsQueries,
      volume: {
        this_week: weekCount || 0,
        this_month: monthCount || 0,
      },
      feedback: {
        total_positive: totalPositive,
        total_negative: totalNegative,
        helpfulness_rate: helpfulnessRate,
        negative_queries: negativeQueries,
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
