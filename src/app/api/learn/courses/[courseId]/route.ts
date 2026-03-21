import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Module, Lesson, Quiz, QuizQuestion, QuizOption } from "@/types";

// GET — fetch single course with all nested data
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await params;
    const email = session.user.email.toLowerCase();

    // 1. Fetch course
    const { data: course, error: courseErr } = await supabaseAdmin
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseErr || !course) {
      return NextResponse.json({ error: courseErr?.message || "Course not found" }, { status: 404 });
    }

    // 2. Fetch modules
    const { data: modules } = await supabaseAdmin
      .from("modules")
      .select("*")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });

    const moduleList: Module[] = modules || [];
    const moduleIds = moduleList.map((m) => m.id);

    // 3. Fetch lessons
    let lessonList: Lesson[] = [];
    if (moduleIds.length > 0) {
      const { data: lessons } = await supabaseAdmin
        .from("lessons")
        .select("*")
        .in("module_id", moduleIds)
        .order("sort_order", { ascending: true });

      lessonList = lessons || [];
    }

    const lessonIds = lessonList.map((l) => l.id);
    const quizLessonIds = lessonList
      .filter((l) => l.lesson_type === "quiz")
      .map((l) => l.id);

    // 4. Fetch quizzes for quiz-type lessons
    let quizList: Quiz[] = [];
    if (quizLessonIds.length > 0) {
      const { data: quizzes } = await supabaseAdmin
        .from("quizzes")
        .select("*")
        .in("lesson_id", quizLessonIds);

      quizList = quizzes || [];
    }

    const quizIds = quizList.map((q) => q.id);

    // 5. Fetch quiz questions
    let questionList: QuizQuestion[] = [];
    if (quizIds.length > 0) {
      const { data: questions } = await supabaseAdmin
        .from("quiz_questions")
        .select("*")
        .in("quiz_id", quizIds)
        .order("sort_order", { ascending: true });

      questionList = questions || [];
    }

    // Strip is_correct and position from options before returning to client
    const safeQuestions = questionList.map((q) => ({
      ...q,
      options: (q.options as QuizOption[]).map(({ id, text }) => ({ id, text })),
    }));

    // 6. Get current user's lms_users row
    const { data: lmsUser } = await supabaseAdmin
      .from("lms_users")
      .select("id")
      .eq("email", email)
      .single();

    // 7. Get enrollment for this user + course
    let enrollment = null;
    if (lmsUser) {
      const { data: enr } = await supabaseAdmin
        .from("enrollments")
        .select("*")
        .eq("user_id", lmsUser.id)
        .eq("course_id", courseId)
        .single();

      enrollment = enr || null;
    }

    // 8. Get lesson progress for this user + these lessons
    let progressList: { lesson_id: string; status: string }[] = [];
    if (lmsUser && lessonIds.length > 0) {
      const { data: progress } = await supabaseAdmin
        .from("lesson_progress")
        .select("*")
        .eq("user_id", lmsUser.id)
        .in("lesson_id", lessonIds);

      progressList = progress || [];
    }

    // 9. Fetch prerequisite course IDs
    const { data: prereqs } = await supabaseAdmin
      .from("course_prerequisites")
      .select("prerequisite_id")
      .eq("course_id", courseId);

    const prerequisiteIds = (prereqs || []).map((p: { prerequisite_id: string }) => p.prerequisite_id);

    // 10. Assemble nested structure
    const progressByLesson = new Map(
      progressList.map((p) => [p.lesson_id, p])
    );

    const quizQuestionsByQuiz = new Map<string, typeof safeQuestions>();
    for (const q of safeQuestions) {
      const arr = quizQuestionsByQuiz.get(q.quiz_id) || [];
      arr.push(q);
      quizQuestionsByQuiz.set(q.quiz_id, arr);
    }

    const quizByLesson = new Map<string, Quiz>();
    for (const quiz of quizList) {
      quizByLesson.set(quiz.lesson_id, {
        ...quiz,
        questions: quizQuestionsByQuiz.get(quiz.id) || [],
      });
    }

    const lessonsByModule = new Map<string, Lesson[]>();
    for (const lesson of lessonList) {
      const arr = lessonsByModule.get(lesson.module_id) || [];
      arr.push({
        ...lesson,
        quiz: quizByLesson.get(lesson.id) || undefined,
        progress: progressByLesson.get(lesson.id) || undefined,
      } as Lesson);
      lessonsByModule.set(lesson.module_id, arr);
    }

    const assembledModules = moduleList.map((mod) => ({
      ...mod,
      lessons: lessonsByModule.get(mod.id) || [],
    }));

    // Compute progress_pct
    const totalLessons = lessonList.length;
    const completedLessons = progressList.filter(
      (p) => p.status === "completed"
    ).length;
    const progressPct =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      ...course,
      modules: assembledModules,
      prerequisite_ids: prerequisiteIds,
      enrollment,
      progress_pct: progressPct,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
