"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import LessonSidebar from "@/components/LessonSidebar";
import LessonContent from "@/components/LessonContent";
import QuizPlayer from "@/components/QuizPlayer";
import type { Course, Lesson } from "@/types";

export default function LessonViewer() {
  useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/learn/courses/${courseId}`);
        const data = await res.json();
        setCourse(data.course || data);
      } catch (err) {
        console.error("Lesson load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  // Auto-mark lesson as in_progress on mount
  useEffect(() => {
    if (!lessonId) return;
    fetch("/api/learn/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson_id: lessonId,
        status: "in_progress",
      }),
    }).catch(console.error);
  }, [lessonId]);

  // Get flat list of all lessons in order
  const allLessons: Lesson[] = (course?.modules || []).flatMap(
    (m) => m.lessons || []
  );

  const currentLesson = allLessons.find((l) => l.id === lessonId);
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const handleSelectLesson = (id: string) => {
    router.push(`/learn/course/${courseId}/lesson/${id}`);
    setSidebarOpen(false);
  };

  const handleMarkComplete = async () => {
    if (completing) return;
    setCompleting(true);
    try {
      await fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonId,
          status: "completed",
        }),
      });

      // Advance to next lesson if available
      if (nextLesson) {
        router.push(`/learn/course/${courseId}/lesson/${nextLesson.id}`);
      } else {
        // Last lesson — show completion screen
        setShowCourseComplete(true);
      }
    } catch (err) {
      console.error("Mark complete error:", err);
    } finally {
      setCompleting(false);
    }
  };

  const handleQuizComplete = async (passed: boolean) => {
    if (passed) {
      await fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson_id: lessonId,
          status: "completed",
        }),
      });
      // If this was the last lesson, show completion
      if (!nextLesson) {
        setShowCourseComplete(true);
      }
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!course || !currentLesson) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <p className="text-sm text-gray-500">Chapter not found.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee] flex">
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Lesson sidebar */}
        <div
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex-shrink-0 transform transition-transform duration-200 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <LessonSidebar
            modules={course.modules || []}
            currentLessonId={lessonId}
            onSelectLesson={handleSelectLesson}
            isSequential={course.is_sequential}
            courseCompleted={course.enrollment?.status === "completed"}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="sticky top-0 z-30 bg-white border-b border-[#E8ECF1] px-4 sm:px-6 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-[#304256] transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <button
              onClick={() => router.push(`/learn/course/${courseId}`)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#304256] transition-colors"
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
              Course Overview
            </button>

            <div className="ml-auto text-[11px] text-gray-400">
              {currentIdx + 1} of {allLessons.length}
            </div>
          </div>

          {/* Lesson content area */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-xl font-bold text-[#304256] mb-6">
              {currentLesson.title}
            </h1>

            {/* Render content or quiz */}
            {currentLesson.lesson_type === "quiz" && currentLesson.quiz ? (
              <QuizPlayer
                quiz={currentLesson.quiz}
                lessonId={lessonId}
                onComplete={handleQuizComplete}
              />
            ) : (
              <LessonContent lesson={currentLesson} onComplete={handleMarkComplete} />
            )}

            {/* Navigation + Mark Complete */}
            <div className="mt-10 pt-6 border-t border-[#E8ECF1]">
              {currentLesson.lesson_type !== "quiz" && (
                <div className="mb-4">
                  <button
                    onClick={handleMarkComplete}
                    disabled={completing}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
                  >
                    {completing
                      ? "Saving..."
                      : nextLesson
                      ? "Mark Complete & Next"
                      : "Mark Complete"}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <button
                    onClick={() =>
                      router.push(
                        `/learn/course/${courseId}/lesson/${prevLesson.id}`
                      )
                    }
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#304256] transition-colors"
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
                    {prevLesson.title}
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    onClick={() =>
                      router.push(
                        `/learn/course/${courseId}/lesson/${nextLesson.id}`
                      )
                    }
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#304256] transition-colors"
                  >
                    {nextLesson.title}
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
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course completion overlay */}
      {showCourseComplete && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#27a28c]/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#304256] mb-2">
              Congratulations!
            </h2>
            <p className="text-sm text-gray-500 mb-1">
              You&apos;ve completed
            </p>
            <p className="text-lg font-semibold text-[#304256] mb-6">
              {course.title}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push(`/learn/course/${courseId}`)}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
              >
                View Course Overview
              </button>
              <button
                onClick={() => router.push("/learn")}
                className="w-full px-4 py-2.5 text-sm font-medium text-[#304256] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Learning Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
