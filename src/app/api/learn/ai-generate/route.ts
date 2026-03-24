import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

interface GeneratedOption {
  text: string;
  is_correct: boolean;
}

interface GeneratedQuestion {
  question_type: string;
  question_text: string;
  explanation: string;
  options: GeneratedOption[];
  points: number;
}

interface GeneratedQuiz {
  passing_score: number;
  questions: GeneratedQuestion[];
}

interface GeneratedLesson {
  title: string;
  lesson_type: "content" | "quiz";
  html_content?: string;
  quiz?: GeneratedQuiz;
}

interface GeneratedModule {
  title: string;
  lessons: GeneratedLesson[];
}

interface GeneratedCourse {
  title: string;
  code: string;
  description: string;
  estimated_minutes: number;
  modules: GeneratedModule[];
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      topic,
      description,
      category,
      tracks,
      difficulty,
      numModules,
      includeQuizzes,
      wikiNodeIds,
      referenceUrls,
      referenceFiles,
      additionalInstructions,
    } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Fetch wiki article content if provided
    let wikiContext = "";
    if (wikiNodeIds && Array.isArray(wikiNodeIds) && wikiNodeIds.length > 0) {
      const { data: wikiNodes } = await supabaseAdmin
        .from("wiki_nodes")
        .select("id, title, html_content")
        .in("id", wikiNodeIds);

      if (wikiNodes && wikiNodes.length > 0) {
        wikiContext = "\n\n## Reference Wiki Articles\n\n";
        for (const node of wikiNodes) {
          const content = node.html_content
            ? stripHtml(node.html_content).slice(0, 800)
            : "";
          if (content) {
            wikiContext += `### ${node.title}\n${content}\n\n`;
          }
        }
      }
    }

    // Fetch reference URL content if provided
    let urlContext = "";
    if (
      referenceUrls &&
      Array.isArray(referenceUrls) &&
      referenceUrls.length > 0
    ) {
      urlContext = "\n\n## Reference URLs Content\n\n";
      for (const url of referenceUrls) {
        if (!url || typeof url !== "string") continue;
        try {
          const response = await fetch(url, {
            headers: { "User-Agent": "AtlasLMS/1.0" },
            signal: AbortSignal.timeout(8000),
          });
          if (response.ok) {
            const html = await response.text();
            const text = stripHtml(html).slice(0, 1000);
            urlContext += `### ${url}\n${text}\n\n`;
          }
        } catch {
          // Skip URLs that fail to fetch
        }
      }
    }

    // Build reference files context if provided
    let fileContext = "";
    if (
      referenceFiles &&
      Array.isArray(referenceFiles) &&
      referenceFiles.length > 0
    ) {
      fileContext = "\n\n## REFERENCE FILES\n\n";
      for (const file of referenceFiles) {
        if (!file || typeof file.content !== "string") continue;
        const text = stripHtml(file.content).slice(0, 2000);
        if (text) {
          fileContext += `### ${file.name}\n${text}\n\n`;
        }
      }
    }

    const quizInstruction = includeQuizzes
      ? `Include a quiz lesson at the end of each module with 3-5 questions. Each quiz lesson should have lesson_type "quiz" and include a quiz object.`
      : `Do NOT include any quiz lessons.`;

    const systemPrompt = `You are an expert course designer for Travel Collection, a luxury travel company operating 16 DMC (Destination Management Company) brands across 22 countries. You create professional training courses for their internal LMS platform called Atlas.

Your task is to generate a complete course structure with rich content. The course should be practical, engaging, and relevant to travel industry professionals.

IMPORTANT RULES:
- Generate EXACTLY ${numModules || 3} modules
- ${quizInstruction}
- Difficulty level: ${difficulty || "Intermediate"}
- Each content lesson should have 300-600 words of substantive training content
- Generate rich styled HTML content with:
  - Headings (h2, h3)
  - Styled callout/tip boxes using div with inline styles (e.g. <div style="background:#f0fdf4;border-left:4px solid #27a28c;padding:12px 16px;margin:16px 0;border-radius:6px">)
  - Tables where relevant (with inline styles for borders and padding)
  - Bullet and numbered lists
  - Bold key terms using <strong>
  - Image placeholder markers like <!-- [Image: description of what visual would help] --> where visuals would help
- For quiz questions, use question_type "single_choice" with 4 options each, one correct
- Course code should be uppercase, short (e.g. "SF-BASICS", "OPS-101")

Respond ONLY with valid JSON in exactly this format (no markdown, no code fences):
{
  "title": "Course Title",
  "code": "CODE",
  "description": "Brief 1-2 sentence description",
  "estimated_minutes": 45,
  "modules": [
    {
      "title": "Module Title",
      "lessons": [
        {
          "title": "Lesson Title",
          "lesson_type": "content",
          "html_content": "<h2>...</h2><p>...</p>"
        },
        {
          "title": "Module Quiz",
          "lesson_type": "quiz",
          "quiz": {
            "passing_score": 70,
            "questions": [
              {
                "question_type": "single_choice",
                "question_text": "What is...?",
                "explanation": "The answer is X because...",
                "options": [
                  {"text": "Correct answer", "is_correct": true},
                  {"text": "Wrong answer 1", "is_correct": false},
                  {"text": "Wrong answer 2", "is_correct": false},
                  {"text": "Wrong answer 3", "is_correct": false}
                ],
                "points": 1
              }
            ]
          }
        }
      ]
    }
  ]
}`;

    let userPrompt = `Create a ${difficulty || "intermediate"} level training course about: ${topic}
${description ? `\nCourse Description / Context: ${description}\n` : ""}
Category: ${category || "General Onboarding"}
Target tracks: ${(tracks || ["general"]).join(", ")}
Number of modules: ${numModules || 3}
Include quizzes: ${includeQuizzes !== false ? "Yes" : "No"}`;

    if (wikiContext) {
      userPrompt += wikiContext;
    }
    if (urlContext) {
      userPrompt += urlContext;
    }
    if (fileContext) {
      userPrompt += fileContext;
    }
    if (additionalInstructions) {
      userPrompt += `\n\nAdditional instructions: ${additionalInstructions}`;
    }

    // Call Claude API
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => {
        if (block.type === "text") return block.text;
        return "";
      })
      .join("");

    // Parse JSON - handle potential markdown code fences
    let jsonText = rawText.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let generated: GeneratedCourse;
    try {
      generated = JSON.parse(jsonText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Validate basic structure
    if (
      !generated.title ||
      !generated.modules ||
      !Array.isArray(generated.modules)
    ) {
      return NextResponse.json(
        { error: "Invalid course structure from AI. Please try again." },
        { status: 500 }
      );
    }

    // Create course in Supabase
    const courseCode =
      generated.code || slugify(generated.title).toUpperCase().slice(0, 20);

    const { data: course, error: courseErr } = await supabaseAdmin
      .from("courses")
      .insert({
        code: courseCode,
        title: generated.title,
        description: generated.description || null,
        category: category || "General Onboarding",
        tracks: tracks || ["general"],
        estimated_minutes: generated.estimated_minutes || 0,
        is_published: false,
        is_sequential: true,
        completion_rule: includeQuizzes !== false ? "all_quizzes" : "all_lessons",
        sort_order: 0,
        created_by: session.user.email,
      })
      .select()
      .single();

    if (courseErr || !course) {
      return NextResponse.json(
        { error: courseErr?.message || "Failed to create course" },
        { status: 500 }
      );
    }

    let modulesCreated = 0;
    let lessonsCreated = 0;
    let quizzesCreated = 0;

    // Create modules, lessons, quizzes
    for (let mIdx = 0; mIdx < generated.modules.length; mIdx++) {
      const mod = generated.modules[mIdx];

      const { data: moduleData, error: modErr } = await supabaseAdmin
        .from("modules")
        .insert({
          course_id: course.id,
          title: mod.title,
          sort_order: mIdx,
        })
        .select()
        .single();

      if (modErr || !moduleData) continue;
      modulesCreated++;

      for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
        const lesson = mod.lessons[lIdx];

        const { data: lessonData, error: lessonErr } = await supabaseAdmin
          .from("lessons")
          .insert({
            module_id: moduleData.id,
            title: lesson.title,
            lesson_type: lesson.lesson_type,
            html_content: lesson.html_content || null,
            sort_order: lIdx,
          })
          .select()
          .single();

        if (lessonErr || !lessonData) continue;
        lessonsCreated++;

        // Create quiz if lesson is a quiz type
        if (lesson.lesson_type === "quiz" && lesson.quiz) {
          const { data: quizData, error: quizErr } = await supabaseAdmin
            .from("quizzes")
            .insert({
              lesson_id: lessonData.id,
              title: lesson.title,
              passing_score: lesson.quiz.passing_score || 70,
              max_attempts: 0,
              shuffle_questions: false,
            })
            .select()
            .single();

          if (quizErr || !quizData) continue;
          quizzesCreated++;

          // Create quiz questions
          if (lesson.quiz.questions && lesson.quiz.questions.length > 0) {
            const questionRows = lesson.quiz.questions.map(
              (q: GeneratedQuestion, qIdx: number) => ({
                quiz_id: quizData.id,
                question_type: q.question_type || "single_choice",
                question_text: q.question_text,
                explanation: q.explanation || null,
                options: (q.options || []).map((o: GeneratedOption) => ({
                  id: randomUUID(),
                  text: o.text,
                  is_correct: o.is_correct,
                })),
                points: q.points ?? 1,
                sort_order: qIdx,
              })
            );

            await supabaseAdmin.from("quiz_questions").insert(questionRows);
          }
        }
      }
    }

    return NextResponse.json({
      courseId: course.id,
      title: generated.title,
      modulesCreated,
      lessonsCreated,
      quizzesCreated,
    });
  } catch (e: unknown) {
    console.error("AI course generation error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
