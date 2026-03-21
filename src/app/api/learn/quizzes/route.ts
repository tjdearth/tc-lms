import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

async function requireCourseCreator() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isCourseCreator(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
}

// GET — fetch quiz with questions (admin: includes is_correct, learner: stripped)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get("quiz_id");
    const lessonId = searchParams.get("lesson_id");

    if (!quizId && !lessonId) {
      return NextResponse.json({ error: "quiz_id or lesson_id is required" }, { status: 400 });
    }

    let query = supabaseAdmin.from("quizzes").select("*");
    if (quizId) query = query.eq("id", quizId);
    if (lessonId) query = query.eq("lesson_id", lessonId);

    const { data: quiz, error } = await query.single();
    if (error || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const { data: questions } = await supabaseAdmin
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("sort_order", { ascending: true });

    const isCreator = isCourseCreator(session.user.email);

    return NextResponse.json({
      ...quiz,
      questions: (questions || []).map((q: Record<string, unknown>) => ({
        ...q,
        options: isCreator
          ? q.options
          : ((q.options as Array<Record<string, unknown>>) || []).map((o) => ({ id: o.id, text: o.text, position: o.position })),
      })),
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST — create or update quiz with questions
export async function POST(req: NextRequest) {
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { lesson_id, title, passing_score, max_attempts, shuffle_questions, questions } = body;

    if (!lesson_id || !title) {
      return NextResponse.json({ error: "lesson_id and title are required" }, { status: 400 });
    }

    // Check if quiz already exists for this lesson
    const { data: existing } = await supabaseAdmin
      .from("quizzes")
      .select("id")
      .eq("lesson_id", lesson_id)
      .single();

    let quizId: string;

    if (existing) {
      // Update existing quiz
      const { data: updated, error: updateErr } = await supabaseAdmin
        .from("quizzes")
        .update({
          title,
          passing_score: passing_score ?? 70,
          max_attempts: max_attempts ?? 0,
          shuffle_questions: shuffle_questions ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (updateErr || !updated) {
        return NextResponse.json({ error: updateErr?.message || "Failed to update quiz" }, { status: 500 });
      }

      quizId = updated.id;
    } else {
      // Create new quiz
      const { data: created, error: createErr } = await supabaseAdmin
        .from("quizzes")
        .insert({
          lesson_id,
          title,
          passing_score: passing_score ?? 70,
          max_attempts: max_attempts ?? 0,
          shuffle_questions: shuffle_questions ?? false,
        })
        .select()
        .single();

      if (createErr || !created) {
        return NextResponse.json({ error: createErr?.message || "Failed to create quiz" }, { status: 500 });
      }

      quizId = created.id;
    }

    // Replace questions: delete existing, then insert new
    if (questions && Array.isArray(questions)) {
      await supabaseAdmin
        .from("quiz_questions")
        .delete()
        .eq("quiz_id", quizId);

      const rows = questions.map((q: Record<string, unknown>, i: number) => ({
        quiz_id: quizId,
        question_type: q.question_type || "single_choice",
        question_text: q.question_text,
        explanation: q.explanation || null,
        options: q.options || [],
        points: q.points ?? 1,
        sort_order: q.sort_order ?? i,
      }));

      if (rows.length > 0) {
        const { error: qErr } = await supabaseAdmin
          .from("quiz_questions")
          .insert(rows);

        if (qErr) {
          return NextResponse.json({ error: qErr.message }, { status: 500 });
        }
      }
    }

    // Return quiz with questions
    const { data: quiz } = await supabaseAdmin
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    const { data: savedQuestions } = await supabaseAdmin
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("sort_order", { ascending: true });

    return NextResponse.json({
      ...quiz,
      questions: savedQuestions || [],
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — delete quiz (CASCADE handles questions)
export async function DELETE(req: NextRequest) {
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("quizzes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
