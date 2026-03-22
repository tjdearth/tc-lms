"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Module, Lesson, LessonType } from "@/types";
import QuizBuilder from "./QuizBuilder";
import WikiNodePicker from "./WikiNodePicker";

const BlockEditor = dynamic(() => import("./BlockEditor"), { ssr: false });

interface ModuleLessonBuilderProps {
  courseId: string;
  modules: Module[];
  onRefresh: () => void;
}

const lessonTypeLabels: Record<LessonType, string> = {
  content: "Content",
  video: "Video",
  quiz: "Quiz",
  wiki_link: "Wiki Link",
};

export default function ModuleLessonBuilder({
  courseId,
  modules,
  onRefresh,
}: ModuleLessonBuilderProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  );
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [editingLessonTitle, setEditingLessonTitle] = useState<string | null>(
    null
  );
  const [lessonTitleDraft, setLessonTitleDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [quizLessonId, setQuizLessonId] = useState<string | null>(null);
  const [wikiPickerLesson, setWikiPickerLesson] = useState<string | null>(null);
  const [editContentLesson, setEditContentLesson] = useState<string | null>(
    null
  );
  const [contentDraft, setContentDraft] = useState("");

  const toggleExpand = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // ── Module CRUD ────────────────────────────────────────

  const addModule = async () => {
    setSaving(true);
    try {
      await fetch("/api/learn/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          title: "New Module",
          sort_order: modules.length,
        }),
      });
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const updateModuleTitle = async (moduleId: string, title: string) => {
    setSaving(true);
    try {
      await fetch("/api/learn/modules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId, title }),
      });
      onRefresh();
    } finally {
      setSaving(false);
      setEditingTitle(null);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    setSaving(true);
    try {
      await fetch("/api/learn/modules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: moduleId }),
      });
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const moveModule = async (index: number, direction: "up" | "down") => {
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= modules.length) return;
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/learn/modules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: modules[index].id,
            sort_order: swapIdx,
          }),
        }),
        fetch("/api/learn/modules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: modules[swapIdx].id,
            sort_order: index,
          }),
        }),
      ]);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  // ── Lesson CRUD ────────────────────────────────────────

  const addLesson = async (moduleId: string, existingLessons: Lesson[]) => {
    setSaving(true);
    try {
      await fetch("/api/learn/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: moduleId,
          title: "New Lesson",
          lesson_type: "content",
          sort_order: existingLessons.length,
        }),
      });
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const updateLesson = async (lessonId: string, updates: Partial<Lesson>) => {
    setSaving(true);
    try {
      await fetch("/api/learn/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lessonId, ...updates }),
      });
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    setSaving(true);
    try {
      await fetch("/api/learn/lessons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lessonId }),
      });
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const moveLesson = async (
    mod: Module,
    lessonIndex: number,
    direction: "up" | "down"
  ) => {
    const lessons = mod.lessons || [];
    const swapIdx = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    if (swapIdx < 0 || swapIdx >= lessons.length) return;
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/learn/lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: lessons[lessonIndex].id,
            sort_order: swapIdx,
          }),
        }),
        fetch("/api/learn/lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: lessons[swapIdx].id,
            sort_order: lessonIndex,
          }),
        }),
      ]);
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {modules.map((mod, mIdx) => {
        const lessons = mod.lessons || [];
        const isExpanded = expandedModules.has(mod.id);

        return (
          <div
            key={mod.id}
            className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden"
          >
            {/* Module header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/50">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveModule(mIdx, "up")}
                  disabled={mIdx === 0 || saving}
                  className="text-gray-400 hover:text-[#304256] disabled:opacity-30 transition-colors"
                  title="Move up"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <button
                  onClick={() => moveModule(mIdx, "down")}
                  disabled={mIdx === modules.length - 1 || saving}
                  className="text-gray-400 hover:text-[#304256] disabled:opacity-30 transition-colors"
                  title="Move down"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              {/* Expand toggle */}
              <button
                onClick={() => toggleExpand(mod.id)}
                className="text-gray-400 hover:text-[#304256] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Module title */}
              {editingTitle === mod.id ? (
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={() => updateModuleTitle(mod.id, titleDraft)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateModuleTitle(mod.id, titleDraft);
                    if (e.key === "Escape") setEditingTitle(null);
                  }}
                  className="flex-1 px-2 py-1 text-sm font-medium text-[#304256] border border-[#27a28c] rounded-lg outline-none"
                />
              ) : (
                <button
                  onClick={() => {
                    setEditingTitle(mod.id);
                    setTitleDraft(mod.title);
                  }}
                  className="flex-1 text-left text-sm font-medium text-[#304256] hover:text-[#27a28c] transition-colors"
                >
                  {mod.title}
                </button>
              )}

              <span className="text-[11px] text-gray-400">
                {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
              </span>

              <button
                onClick={() => deleteModule(mod.id)}
                disabled={saving}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Delete module"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>

            {/* Lessons */}
            {isExpanded && (
              <div className="px-4 pb-3">
                {lessons.length === 0 && (
                  <p className="text-xs text-gray-400 py-3 text-center">
                    No lessons yet
                  </p>
                )}
                {lessons.map((lesson, lIdx) => (
                  <div key={lesson.id}>
                    <div className="flex items-center gap-2 py-2 border-b border-[#E8ECF1] last:border-b-0">
                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveLesson(mod, lIdx, "up")}
                          disabled={lIdx === 0 || saving}
                          className="text-gray-300 hover:text-[#304256] disabled:opacity-30 transition-colors"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveLesson(mod, lIdx, "down")}
                          disabled={lIdx === lessons.length - 1 || saving}
                          className="text-gray-300 hover:text-[#304256] disabled:opacity-30 transition-colors"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                      </div>

                      {/* Type badge */}
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0 uppercase">
                        {lesson.lesson_type}
                      </span>

                      {/* Title */}
                      {editingLessonTitle === lesson.id ? (
                        <input
                          autoFocus
                          value={lessonTitleDraft}
                          onChange={(e) => setLessonTitleDraft(e.target.value)}
                          onBlur={() => {
                            updateLesson(lesson.id, {
                              title: lessonTitleDraft,
                            });
                            setEditingLessonTitle(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateLesson(lesson.id, {
                                title: lessonTitleDraft,
                              });
                              setEditingLessonTitle(null);
                            }
                            if (e.key === "Escape")
                              setEditingLessonTitle(null);
                          }}
                          className="flex-1 px-2 py-1 text-sm border border-[#27a28c] rounded-lg outline-none"
                        />
                      ) : (
                        <button
                          onClick={() => {
                            setEditingLessonTitle(lesson.id);
                            setLessonTitleDraft(lesson.title);
                          }}
                          className="flex-1 text-left text-sm text-[#304256] hover:text-[#27a28c] transition-colors truncate"
                        >
                          {lesson.title}
                        </button>
                      )}

                      {/* Type dropdown */}
                      <select
                        value={lesson.lesson_type}
                        onChange={(e) =>
                          updateLesson(lesson.id, {
                            lesson_type: e.target.value as LessonType,
                          })
                        }
                        className="px-2 py-1 text-xs border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white"
                      >
                        {(Object.keys(lessonTypeLabels) as LessonType[]).map(
                          (lt) => (
                            <option key={lt} value={lt}>
                              {lessonTypeLabels[lt]}
                            </option>
                          )
                        )}
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => deleteLesson(lesson.id)}
                        disabled={saving}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Delete lesson"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Type-specific controls */}
                    <div className="pl-8 pb-2">
                      {lesson.lesson_type === "content" && (
                        <>
                          {editContentLesson === lesson.id ? (
                            <div className="mt-2 space-y-2">
                              <div className="border border-[#E8ECF1] rounded-lg overflow-hidden">
                                <BlockEditor
                                  content={contentDraft}
                                  onChange={setContentDraft}
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    updateLesson(lesson.id, {
                                      html_content: contentDraft,
                                    });
                                    setEditContentLesson(null);
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90"
                                >
                                  Save Content
                                </button>
                                <button
                                  onClick={() => setEditContentLesson(null)}
                                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-[#304256]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditContentLesson(lesson.id);
                                setContentDraft(lesson.html_content || "");
                              }}
                              className="mt-1 text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
                            >
                              Edit Content
                            </button>
                          )}
                        </>
                      )}

                      {lesson.lesson_type === "video" && (
                        <div className="mt-2">
                          <input
                            type="text"
                            defaultValue={lesson.video_url || ""}
                            placeholder="Video URL (YouTube, Vimeo, etc.)"
                            onBlur={(e) =>
                              updateLesson(lesson.id, {
                                video_url: e.target.value || null,
                              })
                            }
                            className="w-full px-3 py-1.5 text-xs border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                          />
                        </div>
                      )}

                      {lesson.lesson_type === "wiki_link" && (
                        <button
                          onClick={() => setWikiPickerLesson(lesson.id)}
                          className="mt-1 text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
                        >
                          {lesson.wiki_node_id
                            ? "Change Wiki Article"
                            : "Select Wiki Article"}
                        </button>
                      )}

                      {lesson.lesson_type === "quiz" && (
                        <button
                          onClick={() =>
                            setQuizLessonId(
                              quizLessonId === lesson.id ? null : lesson.id
                            )
                          }
                          className="mt-1 text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
                        >
                          {quizLessonId === lesson.id
                            ? "Close Quiz Editor"
                            : "Edit Quiz"}
                        </button>
                      )}
                    </div>

                    {/* Inline Quiz Builder */}
                    {lesson.lesson_type === "quiz" &&
                      quizLessonId === lesson.id && (
                        <div className="pl-8 pr-4 pb-4">
                          <QuizBuilder
                            quizId={lesson.id}
                            onSave={() => {
                              setQuizLessonId(null);
                              onRefresh();
                            }}
                          />
                        </div>
                      )}
                  </div>
                ))}

                <button
                  onClick={() => addLesson(mod.id, lessons)}
                  disabled={saving}
                  className="mt-2 flex items-center gap-1.5 text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Lesson
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Add module */}
      <button
        onClick={addModule}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#27a28c] border-2 border-dashed border-[#27a28c]/30 rounded-xl hover:border-[#27a28c]/60 hover:bg-[#27a28c]/5 transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add Module
      </button>

      {/* Wiki Node Picker Modal */}
      <WikiNodePicker
        isOpen={!!wikiPickerLesson}
        onClose={() => setWikiPickerLesson(null)}
        onSelect={(nodeId) => {
          if (wikiPickerLesson) {
            updateLesson(wikiPickerLesson, { wiki_node_id: nodeId });
          }
          setWikiPickerLesson(null);
        }}
      />
    </div>
  );
}
