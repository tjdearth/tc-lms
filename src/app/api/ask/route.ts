import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Anthropic from "@anthropic-ai/sdk";

// Allow up to 30 seconds for this API route (default is 10s)
export const maxDuration = 30;

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
    const [wikiResult, coursesResult, calendarResult, lessonsResult, quizResult, microResult] = await Promise.all([
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
      // Fetch ALL lessons from published courses (no limit)
      supabaseAdmin
        .from("lessons")
        .select("id, title, html_content, transcript, module_id, modules!inner(id, course_id, courses!inner(id, title, is_published))")
        .limit(200),
      // Fetch quiz questions with correct answers
      supabaseAdmin
        .from("quiz_questions")
        .select("id, question_text, options, quizzes!inner(id, lesson_id, lessons!inner(id, module_id, modules!inner(id, course_id, courses!inner(id, is_published))))")
        .limit(100),
      // Fetch published micro-learning lessons (new!)
      supabaseAdmin
        .from("micro_lessons")
        .select("id, title, description, transcript, key_points_html, tags")
        .eq("is_published", true)
        .limit(50),
    ]);

    if (wikiResult.error) console.error("Wiki fetch error:", wikiResult.error.message);
    if (coursesResult.error) console.error("Courses fetch error:", coursesResult.error.message);
    if (calendarResult.error) console.error("Calendar fetch error:", calendarResult.error.message);
    if (lessonsResult.error) console.error("Lessons fetch error:", lessonsResult.error.message);
    if (quizResult.error) console.error("Quiz fetch error:", quizResult.error.message);
    if (microResult.error) console.error("Micro-lessons fetch error:", microResult.error.message);

    const wikiArticles = wikiResult.data || [];
    const courses = coursesResult.data || [];
    const events = calendarResult.data || [];
    const microLessons = microResult.data || [];

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

    // Build context — PRIORITY ORDER: lessons & transcripts first (richest content),
    // then micro-learning, then wiki, then courses/quizzes/events
    let context = "";

    // 1. Course lessons + video transcripts (highest priority — this is where deep knowledge lives)
    if (lessons.length > 0) {
      context += "## Course Lesson Content & Video Transcripts\n\n";
      for (const lesson of lessons) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const courseName = (lesson as any).modules?.courses?.title || "";
        const content = lesson.html_content ? stripHtml(lesson.html_content).slice(0, 1500) : "";
        const transcript = lesson.transcript ? stripHtml(lesson.transcript).slice(0, 2000) : "";
        if (content || transcript) {
          context += `### ${lesson.title}`;
          if (courseName) context += ` (Course: ${courseName})`;
          context += "\n";
          if (content) context += `${content}\n`;
          if (transcript) context += `[Video transcript]: ${transcript}\n`;
          context += "\n";
        }
      }
    }

    // 2. Micro-learning lessons (new!)
    if (microLessons.length > 0) {
      context += "## Micro-Learning Lessons\n\n";
      for (const ml of microLessons) {
        const keyPoints = ml.key_points_html ? stripHtml(ml.key_points_html).slice(0, 1000) : "";
        const transcript = ml.transcript ? stripHtml(ml.transcript).slice(0, 1500) : "";
        const tags = ml.tags ? (ml.tags as string[]).join(", ") : "";
        context += `### ${ml.title} [MICRO_ID:${ml.id}]`;
        if (tags) context += ` (Tags: ${tags})`;
        context += "\n";
        if (ml.description) context += `${ml.description}\n`;
        if (keyPoints) context += `Key points: ${keyPoints}\n`;
        if (transcript) context += `[Video transcript]: ${transcript}\n`;
        context += "\n";
      }
    }

    // 3. Wiki articles
    if (wikiArticles.length > 0) {
      context += "## Wiki Articles\n\n";
      for (const article of wikiArticles) {
        const content = article.html_content ? stripHtml(article.html_content).slice(0, 500) : "";
        if (content) {
          context += `### ${article.title} [WIKI_ID:${article.id}]\n${content}\n\n`;
        }
      }
    }

    // 4. Course list
    if (courses.length > 0) {
      context += "## Available Courses\n\n";
      for (const course of courses) {
        context += `- **${course.title}** [COURSE_ID:${course.id}] (${course.category}): ${course.description || "No description"}\n`;
      }
      context += "\n";
    }

    // 5. Quiz Q&A
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

    // 6. Calendar events
    if (events.length > 0) {
      context += "## Upcoming Calendar Events\n\n";
      for (const event of events.slice(0, 50)) {
        context += `- **${event.title}** — ${event.date_start} (${event.brand}, ${event.country})`;
        if (event.impact_notes) context += ` — ${event.impact_notes}`;
        context += "\n";
      }
      context += "\n";
    }

    // Truncate context if too large (keep under ~80k chars — Claude Sonnet handles this fine)
    const maxContextChars = 80000;
    if (context.length > maxContextChars) {
      console.log(`Ask Atlas: context truncated from ${context.length} to ${maxContextChars} chars`);
      context = context.slice(0, maxContextChars) + "\n\n[Context truncated for performance]";
    }

    const finalSystemPrompt = `You are Claudette, the AI assistant for Atlas — Travel Collection's internal knowledge and learning platform. Travel Collection is a luxury travel company operating 16 DMC (Destination Management Company) brands across 22 countries.

You help employees find information about company processes, training courses, wiki articles, and upcoming events across the TC network.

Your personality: helpful, professional, and knowledgeable. You speak concisely and use the employee's context to personalize answers.

The user's email is "${email}".

Use the following Atlas knowledge base to answer questions. If the answer is in the knowledge base, reference the relevant source with a hyperlink.

IMPORTANT LINKING FORMAT:
- Wiki articles: [Article Title](/wiki?article=ARTICLE_ID) — replace ARTICLE_ID with the ID shown in brackets like [WIKI_ID:xxx]
- Courses: [Course Title](/learn/course/COURSE_ID) — replace COURSE_ID with [COURSE_ID:xxx]
- Micro-learning: [Lesson Title](/learn/micro-learning/LESSON_ID) — replace LESSON_ID with [MICRO_ID:xxx]

Always prefer linking to sources rather than just naming them. When answering from video transcripts or lesson content, mention which course or lesson the information comes from.

Be concise and use markdown formatting. Only introduce yourself if it seems like a first message.

--- ATLAS KNOWLEDGE BASE ---
${context}`;

    const anthropic = new Anthropic();

    // Retry up to 2 times on overloaded errors (529)
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: finalSystemPrompt,
          messages: [{ role: "user", content: question }],
        });
        break; // success
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        if (errMsg.includes("529") || errMsg.includes("overloaded")) {
          if (attempt < 2) {
            console.log(`Ask Atlas: Claude overloaded, retrying (attempt ${attempt + 2}/3)...`);
            await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
            continue;
          }
        }
        throw err; // non-retryable error
      }
    }

    if (!response) {
      return NextResponse.json({ error: "Atlas AI is temporarily busy. Please try again in a moment." }, { status: 503 });
    }

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
