import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Anthropic from "@anthropic-ai/sdk";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const email = session.user.email;

    // Fetch context from all relevant tables in parallel
    const [wikiResult, coursesResult, calendarResult] = await Promise.all([
      supabaseAdmin
        .from("wiki_nodes")
        .select("title, html_content")
        .eq("is_published", true)
        .eq("node_type", "article")
        .limit(100),
      supabaseAdmin
        .from("courses")
        .select("title, description, category")
        .eq("is_published", true),
      supabaseAdmin
        .from("calendar_events")
        .select("title, date_start, brand, country, event_type, impact_notes")
        .gte("date_start", new Date().toISOString().slice(0, 10))
        .order("date_start")
        .limit(100),
    ]);

    const wikiArticles = wikiResult.data || [];
    const courses = coursesResult.data || [];
    const events = calendarResult.data || [];

    // Build context
    let context = "";

    if (wikiArticles.length > 0) {
      context += "## Wiki Articles\n\n";
      for (const article of wikiArticles) {
        const content = article.html_content ? stripHtml(article.html_content).slice(0, 500) : "";
        if (content) {
          context += `### ${article.title}\n${content}\n\n`;
        }
      }
    }

    if (courses.length > 0) {
      context += "## Available Courses\n\n";
      for (const course of courses) {
        context += `- **${course.title}** (${course.category}): ${course.description || "No description"}\n`;
      }
      context += "\n";
    }

    if (events.length > 0) {
      context += "## Upcoming Calendar Events\n\n";
      for (const event of events.slice(0, 50)) {
        context += `- **${event.title}** — ${event.date_start} (${event.brand}, ${event.country})`;
        if (event.impact_notes) context += ` — ${event.impact_notes}`;
        context += "\n";
      }
      context += "\n";
    }

    const systemPrompt = `You are Claudette, the AI assistant for Atlas — Travel Collection's internal knowledge and learning platform. Travel Collection is a luxury travel company operating 16 DMC (Destination Management Company) brands across 22 countries.

You help employees find information about company processes, training courses, wiki articles, and upcoming events across the TC network.

Your personality: helpful, professional, and knowledgeable. You speak concisely and use the employee's context to personalize answers.

The user's email is "${email}".

Use the following Atlas knowledge base to answer questions. If the answer is in the knowledge base, reference the relevant source. If you cannot find a specific answer, say so honestly and suggest where they might find it.

Be concise and use markdown formatting. Only introduce yourself if it seems like a first message.

--- ATLAS KNOWLEDGE BASE ---
${context}`;

    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    });

    const answer = response.content
      .filter((block) => block.type === "text")
      .map((block) => {
        if (block.type === "text") return block.text;
        return "";
      })
      .join("");

    return NextResponse.json({ answer });
  } catch (e: unknown) {
    console.error("Ask Atlas error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
