"use client";

import { useState } from "react";
import type { Module, Lesson, LessonStatus } from "@/types";

interface LessonSidebarProps {
  modules: Module[];
  currentLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
  isSequential?: boolean;
  courseCompleted?: boolean;
}

function StatusIcon({ status }: { status?: LessonStatus }) {
  if (status === "completed") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  if (status === "in_progress") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
        <circle cx="12" cy="12" r="10" stroke="#27a28c" strokeWidth="2" fill="none" />
        <path d="M12 2a10 10 0 0 1 0 20" fill="#27a28c" opacity="0.3" />
      </svg>
    );
  }
  // not_started
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function isLessonLocked(
  modules: Module[],
  lessonId: string,
  isSequential: boolean
): boolean {
  if (!isSequential) return false;

  // Flatten all lessons in order
  const allLessons: Lesson[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons || []) {
      allLessons.push(lesson);
    }
  }

  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return false;

  // Locked if previous lesson is not completed
  const prev = allLessons[idx - 1];
  return prev.progress?.status !== "completed";
}

export default function LessonSidebar({
  modules,
  currentLessonId,
  onSelectLesson,
  isSequential = false,
  courseCompleted = false,
}: LessonSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      modules.forEach((mod) => {
        initial[mod.id] = true;
      });
      return initial;
    }
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-white border-r border-[#E8ECF1]">
      <div className="py-2">
        {modules.map((mod) => {
          const isExpanded = expandedModules[mod.id] !== false;
          return (
            <div key={mod.id}>
              {/* Module header - collapsible */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-2 px-4 pt-4 pb-1 group"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`flex-shrink-0 text-gray-400 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {mod.title}
                </p>
              </button>

              {/* Lessons */}
              {isExpanded &&
                (mod.lessons || []).map((lesson) => {
                  const isCurrent = lesson.id === currentLessonId;
                  const locked = courseCompleted ? false : isLessonLocked(modules, lesson.id, isSequential);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !locked && onSelectLesson(lesson.id)}
                      disabled={locked}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                        isCurrent
                          ? "bg-[#27a28c]/10 border-r-2 border-[#27a28c]"
                          : locked
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {locked ? (
                        <LockIcon />
                      ) : (
                        <StatusIcon status={lesson.progress?.status} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm truncate ${
                            isCurrent
                              ? "font-medium text-[#27a28c]"
                              : "text-[#304256]"
                          }`}
                        >
                          {lesson.title}
                        </p>
                        {lesson.estimated_minutes > 0 && (
                          <p className="text-[11px] text-gray-400">
                            {lesson.estimated_minutes} min
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
