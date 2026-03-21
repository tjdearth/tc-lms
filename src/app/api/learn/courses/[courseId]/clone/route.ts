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

// POST — deep-clone a course
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const denied = await requireCourseCreator();
  if (denied) return denied;
  try {
    const { courseId } = await params;

    // 1. Fetch original course
    const { data: original, error: courseErr } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseErr || !original) {
      return NextResponse.json({ error: courseErr?.message || "Course not found" }, { status: 404 });
    }

    // 2. Create new course
    const { data: newCourse, error: newCourseErr } = await supabaseAdmin
      .from("courses")
      .insert({
        code: original.code + "-COPY",
        title: original.title + " (Copy)",
        description: original.description,
        thumbnail_url: original.thumbnail_url,
        category: original.category,
        tracks: original.tracks,
        estimated_minutes: original.estimated_minutes,
        is_published: false,
        is_sequential: original.is_sequential,
        completion_rule: original.completion_rule,
        min_score_pct: original.min_score_pct,
        sort_order: original.sort_order,
        created_by: original.created_by,
      })
      .select()
      .single();

    if (newCourseErr || !newCourse) {
      return NextResponse.json({ error: newCourseErr?.message || "Failed to create course copy" }, { status: 500 });
    }

    // 3. Fetch and clone modules
    const { data: modules } = await supabaseAdmin
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });

    const moduleIdMap = new Map<string, string>(); // old -> new

    if (modules && modules.length > 0) {
      for (const mod of modules) {
        const { data: newMod } = await supabaseAdmin
          .from("modules")
          .insert({
            course_id: newCourse.id,
            title: mod.title,
            description: mod.description,
            sort_order: mod.sort_order,
          })
          .select()
          .single();

        if (newMod) {
          moduleIdMap.set(mod.id, newMod.id);
        }
      }
    }

    // 4. Fetch and clone lessons
    const oldModuleIds = Array.from(moduleIdMap.keys());
    const lessonIdMap = new Map<string, string>(); // old -> new

    if (oldModuleIds.length > 0) {
      const { data: lessons } = await supabaseAdmin
        .from("lessons")
        .select("*")
        .in("module_id", oldModuleIds)
        .order("sort_order", { ascending: true });

      if (lessons && lessons.length > 0) {
        for (const lesson of lessons) {
          const newModuleId = moduleIdMap.get(lesson.module_id);
          if (!newModuleId) continue;

          const { data: newLesson } = await supabaseAdmin
            .from("lessons")
            .insert({
              module_id: newModuleId,
              title: lesson.title,
              lesson_type: lesson.lesson_type,
              html_content: lesson.html_content,
              wiki_node_id: lesson.wiki_node_id,
              video_url: lesson.video_url,
              estimated_minutes: lesson.estimated_minutes,
              sort_order: lesson.sort_order,
            })
            .select()
            .single();

          if (newLesson) {
            lessonIdMap.set(lesson.id, newLesson.id);
          }
        }
      }
    }

    // 5. Fetch and clone quizzes
    const oldLessonIds = Array.from(lessonIdMap.keys());
    const quizIdMap = new Map<string, string>(); // old -> new

    if (oldLessonIds.length > 0) {
      const { data: quizzes } = await supabaseAdmin
        .from("quizzes")
        .select("*")
        .in("lesson_id", oldLessonIds);

      if (quizzes && quizzes.length > 0) {
        for (const quiz of quizzes) {
          const newLessonId = lessonIdMap.get(quiz.lesson_id);
          if (!newLessonId) continue;

          const { data: newQuiz } = await supabaseAdmin
            .from("quizzes")
            .insert({
              lesson_id: newLessonId,
              title: quiz.title,
              passing_score: quiz.passing_score,
              max_attempts: quiz.max_attempts,
              shuffle_questions: quiz.shuffle_questions,
            })
            .select()
            .single();

          if (newQuiz) {
            quizIdMap.set(quiz.id, newQuiz.id);
          }
        }
      }
    }

    // 6. Fetch and clone quiz questions
    const oldQuizIds = Array.from(quizIdMap.keys());

    if (oldQuizIds.length > 0) {
      const { data: questions } = await supabaseAdmin
        .from("quiz_questions")
        .select("*")
        .in("quiz_id", oldQuizIds)
        .order("sort_order", { ascending: true });

      if (questions && questions.length > 0) {
        for (const q of questions) {
          const newQuizId = quizIdMap.get(q.quiz_id);
          if (!newQuizId) continue;

          await supabaseAdmin
            .from("quiz_questions")
            .insert({
              quiz_id: newQuizId,
              question_type: q.question_type,
              question_text: q.question_text,
              explanation: q.explanation,
              options: q.options,
              points: q.points,
              sort_order: q.sort_order,
            });
        }
      }
    }

    return NextResponse.json(newCourse);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
