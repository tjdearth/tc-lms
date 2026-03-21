import { supabase } from "@/lib/supabase";
import type {
  Course,
  LmsUser,
  Enrollment,
  Module,
  Lesson,
  LmsTrack,
  CourseTemplate,
  LessonType,
} from "@/types";

export async function fetchLmsUser(email: string): Promise<LmsUser | null> {
  const { data } = await supabase
    .from("lms_users")
    .select("*")
    .eq("email", email)
    .single();
  return data;
}

export async function fetchCourses(filters?: {
  category?: string;
  track?: LmsTrack;
  published?: boolean;
}): Promise<Course[]> {
  let query = supabase.from("courses").select("*").order("sort_order");
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.published !== undefined)
    query = query.eq("is_published", filters.published);
  if (filters?.track) query = query.contains("tracks", [filters.track]);
  const { data } = await query;
  return data || [];
}

export async function fetchCourseDetail(
  courseId: string,
  userEmail?: string
): Promise<Course | null> {
  // 1. Fetch course
  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();
  if (!course) return null;

  // 2. Fetch modules
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", courseId)
    .order("sort_order");

  // 3. Fetch lessons for all modules
  const moduleIds = (modules || []).map((m: Module) => m.id);
  const { data: lessons } = moduleIds.length
    ? await supabase
        .from("lessons")
        .select("*")
        .in("module_id", moduleIds)
        .order("sort_order")
    : { data: [] };

  // 4. Fetch quizzes for quiz-type lessons
  const lessonIds = (lessons || []).map((l: Lesson) => l.id);
  const { data: quizzes } = lessonIds.length
    ? await supabase
        .from("quizzes")
        .select("*")
        .in("lesson_id", lessonIds)
    : { data: [] };

  // 5. Fetch quiz questions (strip is_correct for client)
  const quizIds = (quizzes || []).map((q: { id: string }) => q.id);
  const { data: questions } = quizIds.length
    ? await supabase
        .from("quiz_questions")
        .select("*")
        .in("quiz_id", quizIds)
        .order("sort_order")
    : { data: [] };

  // 6-7. User-specific data
  let enrollment = undefined;
  const progressMap: Record<
    string,
    { status: string; started_at: string | null; completed_at: string | null }
  > = {};
  if (userEmail) {
    const { data: user } = await supabase
      .from("lms_users")
      .select("id")
      .eq("email", userEmail)
      .single();
    if (user) {
      const { data: enr } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .single();
      enrollment = enr || undefined;
      if (lessonIds.length) {
        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("*")
          .in("lesson_id", lessonIds)
          .eq("user_id", user.id);
        (progress || []).forEach(
          (p: {
            lesson_id: string;
            status: string;
            started_at: string | null;
            completed_at: string | null;
          }) => {
            progressMap[p.lesson_id] = p;
          }
        );
      }
    }
  }

  // 8. Prerequisites
  const { data: prereqs } = await supabase
    .from("course_prerequisites")
    .select("prerequisite_id")
    .eq("course_id", courseId);

  // Assemble - strip is_correct from options for client
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const strippedQuestions = (questions || []).map((q: any) => ({
    ...q,
    options: (q.options || []).map((o: any) => ({ id: o.id, text: o.text })),
  }));

  const quizMap: Record<string, any> = {};
  (quizzes || []).forEach((q: any) => {
    quizMap[q.lesson_id] = {
      ...q,
      questions: strippedQuestions.filter((qq: any) => qq.quiz_id === q.id),
    };
  });

  const lessonsByModule: Record<string, Lesson[]> = {};
  (lessons || []).forEach((l: any) => {
    if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
    lessonsByModule[l.module_id].push({
      ...l,
      quiz: quizMap[l.id] || undefined,
      progress: progressMap[l.id] || undefined,
    });
  });

  const assembledModules = (modules || []).map((m: any) => ({
    ...m,
    lessons: lessonsByModule[m.id] || [],
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const result: Course = {
    ...course,
    modules: assembledModules,
    prerequisite_ids: (prereqs || []).map((p: { prerequisite_id: string }) => p.prerequisite_id),
    enrollment,
    progress_pct: computeProgressPct({
      ...course,
      modules: assembledModules,
    }),
  };

  return result;
}

export async function fetchUserEnrollments(
  userEmail: string
): Promise<(Enrollment & { course: Course })[]> {
  const { data: user } = await supabase
    .from("lms_users")
    .select("id")
    .eq("email", userEmail)
    .single();
  if (!user) return [];
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, course:courses(*)")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (enrollments || []).map((e: any) => ({ ...e, course: e.course }));
}

export function computeProgressPct(course: Course): number {
  const lessons = (course.modules || []).flatMap((m) => m.lessons || []);
  if (lessons.length === 0) return 0;
  const completed = lessons.filter(
    (l) => l.progress?.status === "completed"
  ).length;
  return Math.round((completed / lessons.length) * 100);
}

export const COURSE_TEMPLATES: CourseTemplate[] = [
  {
    name: "General Onboarding",
    description:
      "Standard new-hire onboarding course with welcome video and knowledge check",
    category: "general_onboarding",
    modules: [
      {
        title: "Welcome",
        lessons: [
          {
            title: "Welcome to Travel Collection",
            type: "video" as LessonType,
          },
          { title: "Company Overview", type: "content" as LessonType },
        ],
      },
      {
        title: "Getting Started",
        lessons: [
          { title: "Your First Week", type: "content" as LessonType },
          { title: "Knowledge Check", type: "quiz" as LessonType },
        ],
      },
    ],
  },
  {
    name: "Salesforce Training",
    description:
      "Salesforce Academy course template with wiki links and assessment",
    category: "salesforce_academy",
    modules: [
      {
        title: "SF Basics",
        lessons: [
          { title: "Introduction", type: "content" as LessonType },
          { title: "Navigation Guide", type: "wiki_link" as LessonType },
        ],
      },
      {
        title: "Hands-On Practice",
        lessons: [
          { title: "Practice Exercises", type: "content" as LessonType },
        ],
      },
      {
        title: "Assessment",
        lessons: [{ title: "Final Quiz", type: "quiz" as LessonType }],
      },
    ],
  },
  {
    name: "Quick Training",
    description: "Short video-based training with a quiz",
    category: "general_onboarding",
    modules: [
      {
        title: "Training",
        lessons: [
          { title: "Watch Video", type: "video" as LessonType },
          { title: "Quick Quiz", type: "quiz" as LessonType },
        ],
      },
    ],
  },
  {
    name: "Video Series",
    description: "Multi-part video series course",
    category: "general_onboarding",
    modules: [
      {
        title: "Part 1",
        lessons: [{ title: "Video 1", type: "video" as LessonType }],
      },
      {
        title: "Part 2",
        lessons: [{ title: "Video 2", type: "video" as LessonType }],
      },
      {
        title: "Part 3",
        lessons: [{ title: "Video 3", type: "video" as LessonType }],
      },
    ],
  },
  {
    name: "Blank Course",
    description: "Empty course -- build from scratch",
    category: "general_onboarding",
    modules: [],
  },
];
