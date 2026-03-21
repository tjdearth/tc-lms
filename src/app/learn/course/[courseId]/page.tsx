"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import CourseProgress from "@/components/CourseProgress";
import type { Course, Enrollment, Lesson } from "@/types";

export default function CourseOverview() {
  useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [prerequisitesMet, setPrerequisitesMet] = useState(true);
  const [unmetPrereqs, setUnmetPrereqs] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/learn/courses/${courseId}`);
        const data = await res.json();

        const courseData = data.course || data;
        setCourse(courseData);
        setEnrollment(data.enrollment || courseData.enrollment || null);

        // Check prerequisites — API returns prerequisite_ids
        const prereqIds: string[] = courseData.prerequisite_ids || data.prerequisite_ids || [];
        if (prereqIds.length > 0 && !(data.enrollment || courseData.enrollment)) {
          try {
            const enrollRes = await fetch("/api/learn/enroll");
            const enrollments = await enrollRes.json();
            const completedCourseIds = new Set(
              (Array.isArray(enrollments) ? enrollments : [])
                .filter((e: Enrollment) => e.status === "completed")
                .map((e: Enrollment) => e.course_id)
            );
            const unmet = prereqIds.filter((id: string) => !completedCourseIds.has(id));
            if (unmet.length > 0) {
              setPrerequisitesMet(false);
              const allCoursesRes = await fetch("/api/learn/courses");
              const allCourses: Course[] = await allCoursesRes.json();
              setUnmetPrereqs(allCourses.filter((c) => unmet.includes(c.id)));
            }
          } catch {
            // If check fails, allow — server enforces on enroll
          }
        }

        // Expand first module by default
        const mods = courseData.modules || data.modules || [];
        if (mods.length > 0) {
          setExpandedModules(new Set([mods[0].id]));
        }
      } catch (err) {
        console.error("Course load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  const handleEnroll = async () => {
    if (enrolling) return;
    setEnrolling(true);
    try {
      const res = await fetch("/api/learn/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId }),
      });
      const data: Enrollment = await res.json();
      setEnrollment(data);
    } catch (err) {
      console.error("Enroll error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Find the first incomplete lesson to continue
  const findContinueLesson = (): string | null => {
    if (!course?.modules) return null;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons || []) {
        if (lesson.progress?.status !== "completed") return lesson.id;
      }
    }
    // All done, return first lesson
    return course.modules[0]?.lessons?.[0]?.id || null;
  };

  function getLessonStatusIcon(lesson: Lesson) {
    const status = lesson.progress?.status;
    if (status === "completed") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#27a28c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    }
    if (status === "in_progress") {
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#27a28c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="10 8 16 12 10 16 10 8" />
        </svg>
      );
    }
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <p className="text-sm text-gray-500">Course not found.</p>
        </div>
      </AppShell>
    );
  }

  const progressPct = course.progress_pct ?? 0;
  const totalLessons = (course.modules || []).reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  );

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        {/* Hero header */}
        <div className="bg-gradient-to-br from-[#304256] to-[#0F1923] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            <button
              onClick={() => router.push("/learn/courses")}
              className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs mb-6 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Catalog
            </button>

            <div className="flex items-start gap-6">
              <div className="flex-1">
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-medium bg-white/10 rounded-full mb-3 capitalize">
                  {course.category.replace(/_/g, " ")}
                </span>
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                <p className="text-sm text-white/70 mb-4 max-w-xl">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span>{course.estimated_minutes} min</span>
                  <span>{totalLessons} lessons</span>
                  <span>
                    {(course.modules || []).length} module
                    {(course.modules || []).length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Progress ring */}
              {enrollment && (
                <div className="hidden sm:block flex-shrink-0">
                  <CourseProgress percent={progressPct} size={72} strokeWidth={5} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Prerequisites warning */}
          {!prerequisitesMet && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-amber-800 mb-2">
                Complete these courses first:
              </p>
              <div className="space-y-1.5">
                {unmetPrereqs.map((prereq) => (
                  <button
                    key={prereq.id}
                    onClick={() =>
                      router.push(`/learn/course/${prereq.id}`)
                    }
                    className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    {prereq.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enrollment action */}
          {!enrollment && prerequisitesMet && (
            <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-6 mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#304256]">
                  Ready to start?
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enroll to track your progress.
                </p>
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
              >
                {enrolling ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          )}

          {enrollment && (
            <div className="mb-6">
              <button
                onClick={() => {
                  const lessonId = findContinueLesson();
                  if (lessonId) {
                    router.push(
                      `/learn/course/${courseId}/lesson/${lessonId}`
                    );
                  }
                }}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
              >
                {enrollment.status === "enrolled"
                  ? "Start Course"
                  : "Continue Learning"}
              </button>
            </div>
          )}

          {/* Module accordion */}
          <div className="space-y-3">
            {(course.modules || []).map((mod, modIdx) => {
              const isExpanded = expandedModules.has(mod.id);
              const lessonCount = mod.lessons?.length || 0;
              const completedLessons = (mod.lessons || []).filter(
                (l) => l.progress?.status === "completed"
              ).length;

              return (
                <div
                  key={mod.id}
                  className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleModule(mod.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#304256] text-white flex items-center justify-center text-xs font-medium">
                        {modIdx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#304256]">
                          {mod.title}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {completedLessons}/{lessonCount} lessons completed
                        </p>
                      </div>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#E8ECF1]">
                      {(mod.lessons || []).map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (enrollment) {
                              router.push(
                                `/learn/course/${courseId}/lesson/${lesson.id}`
                              );
                            }
                          }}
                          disabled={!enrollment}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-[#E8ECF1] last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {getLessonStatusIcon(lesson)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#304256] truncate">
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gray-400 capitalize">
                                {lesson.lesson_type.replace(/_/g, " ")}
                              </span>
                              {lesson.estimated_minutes > 0 && (
                                <span className="text-[10px] text-gray-400">
                                  {lesson.estimated_minutes} min
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
