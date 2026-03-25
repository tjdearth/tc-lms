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

    // Fetch context from all relevant tables in parallel (use allSettled so one failure doesn't break all)
    const [wikiResult, coursesResult, calendarResult, lessonsResult, quizResult] = await Promise.all([
      supabaseAdmin
        .from("wiki_nodes")
        .select("id, title, html_content")
        .eq("is_published", true)
        .eq("node_type", "article")
        .limit(100),
      supabaseAdmin
        .from("courses")
        .select("id, title, description, category")
        .eq("is_published", true),
      supabaseAdmin
        .from("calendar_events")
        .select("title, date_start, brand, country, event_type, impact_notes")
        .gte("date_start", new Date().toISOString().slice(0, 10))
        .order("date_start")
        .limit(100),
      // Fetch lessons from published courses (lessons → modules → courses)
      supabaseAdmin
        .from("lessons")
        .select("id, title, html_content, transcript, module_id, modules!inner(id, course_id, courses!inner(id, is_published))")
        .limit(50),
      // Fetch quiz questions with correct answers (quiz_questions → quizzes → lessons → modules → courses)
      supabaseAdmin
        .from("quiz_questions")
        .select("id, question_text, options, quizzes!inner(id, lesson_id, lessons!inner(id, module_id, modules!inner(id, course_id, courses!inner(id, is_published))))")
        .limit(100),
    ]);

    if (wikiResult.error) console.error("Wiki fetch error:", wikiResult.error.message);
    if (coursesResult.error) console.error("Courses fetch error:", coursesResult.error.message);
    if (calendarResult.error) console.error("Calendar fetch error:", calendarResult.error.message);
    if (lessonsResult.error) console.error("Lessons fetch error:", lessonsResult.error.message);
    if (quizResult.error) console.error("Quiz fetch error:", quizResult.error.message);

    const wikiArticles = wikiResult.data || [];
    const courses = coursesResult.data || [];
    const events = calendarResult.data || [];

    // Filter lessons to only those from published courses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lessons = (lessonsResult.data || []).filter((l: any) => {
      try {
        return l.modules?.courses?.is_published === true;
      } catch { return false; }
    });

    // Filter quiz questions to only those from published courses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quizQuestions = (quizResult.data || []).filter((q: any) => {
      try {
        return q.quizzes?.lessons?.modules?.courses?.is_published === true;
      } catch { return false; }
    });

    // Build context
    let context = "";

    if (wikiArticles.length > 0) {
      context += "## Wiki Articles\n\n";
      for (const article of wikiArticles) {
        const content = article.html_content ? stripHtml(article.html_content).slice(0, 500) : "";
        if (content) {
          context += `### ${article.title} [WIKI_ID:${article.id}]\n${content}\n\n`;
        }
      }
    }

    if (courses.length > 0) {
      context += "## Available Courses\n\n";
      for (const course of courses) {
        context += `- **${course.title}** [COURSE_ID:${course.id}] (${course.category}): ${course.description || "No description"}\n`;
      }
      context += "\n";
    }

    if (lessons.length > 0) {
      context += "## Lesson Content\n\n";
      for (const lesson of lessons) {
        const content = lesson.html_content ? stripHtml(lesson.html_content).slice(0, 300) : "";
        const transcript = lesson.transcript ? stripHtml(lesson.transcript).slice(0, 500) : "";
        if (content || transcript) {
          context += `### ${lesson.title}\n`;
          if (content) context += `${content}\n`;
          if (transcript) context += `[Video transcript]: ${transcript}\n`;
          context += "\n";
        }
      }
    }

    if (quizQuestions.length > 0) {
      context += "## Quiz Questions & Answers\n\n";
      for (const q of quizQuestions) {
        const options = (q.options || []) as { id: string; text: string; is_correct?: boolean }[];
        const correctOptions = options.filter((o) => o.is_correct);
        const correctAnswer = correctOptions.map((o) => o.text).join(", ");
        if (correctAnswer) {
          context += `Q: ${q.question_text}\nA: ${correctAnswer}\n\n`;
        }
      }
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

    // Truncate context if too large (keep under ~50k chars to avoid timeout)
    const maxContextChars = 50000;
    if (context.length > maxContextChars) {
      console.log(`Ask Atlas: context truncated from ${context.length} to ${maxContextChars} chars`);
      context = context.slice(0, maxContextChars) + "\n\n[Context truncated for performance]";
    }

    const finalSystemPrompt = `You are Claudette, the AI assistant for Atlas — Travel Collection's internal knowledge and learning platform. Travel Collection is a luxury travel company operating 16 DMC (Destination Management Company) brands across 22 countries.

You help employees find information about company processes, training courses, wiki articles, and upcoming events across the TC network.

Your personality: helpful, professional, and knowledgeable. You speak concisely and use the employee's context to personalize answers.

The user's email is "${email}".

Use the following Atlas knowledge base to answer questions. If the answer is in the knowledge base, reference the relevant source with a hyperlink.

IMPORTANT: When referencing wiki articles, link to them using this format: [Article Title](/wiki?article=ARTICLE_ID) — replace ARTICLE_ID with the ID shown in brackets like [WIKI_ID:xxx]. When referencing courses, link using: [Course Title](/learn/course/COURSE_ID). Always prefer linking to sources rather than just naming them.

Be concise and use markdown formatting. Only introduce yourself if it seems like a first message.

--- ATLAS KNOWLEDGE BASE ---
${context}`;

    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: finalSystemPrompt,
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
