import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { transcript } = await req.json();
    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const anthropic = new Anthropic();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: `You are an expert content summarizer for a corporate learning platform. Generate a clean, professional HTML summary of key points from a video transcript.

Requirements:
- Start with a highlight box: a div with a left teal border (#27a28c), light background (#f0fdf9), padding, containing a bold "Key Takeaway" header and 1-2 sentence summary
- Then list 4-6 key points as bullet points
- Each bullet should have a bold header phrase followed by a brief explanation
- Use clean inline styles compatible with both web and email rendering
- Keep it concise and scannable — this is for busy professionals
- Use colors: teal (#27a28c) for accents, navy (#304256) for text
- Do NOT use any external CSS classes — only inline styles
- Return ONLY the HTML, no markdown wrapping`,
      messages: [
        {
          role: "user",
          content: `Please generate key points HTML from this transcript:\n\n${transcript.slice(0, 15000)}`,
        },
      ],
    });

    const key_points_html = response.content
      .filter((block) => block.type === "text")
      .map((block) => {
        if (block.type === "text") return block.text;
        return "";
      })
      .join("");

    return NextResponse.json({ key_points_html });
  } catch (e: unknown) {
    console.error("Generate summary error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
