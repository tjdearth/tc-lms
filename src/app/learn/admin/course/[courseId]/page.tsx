"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import ModuleLessonBuilder from "@/components/ModuleLessonBuilder";
import QuizBuilder from "@/components/QuizBuilder";
import EnrollmentManager from "@/components/EnrollmentManager";
import { isCourseCreator } from "@/lib/admin";
import { fetchCourseDetail, fetchCourses } from "@/lib/learn-api";
import type { Course, LmsTrack, CompletionRule, Lesson } from "@/types";

const CATEGORIES = [
  { value: "General Onboarding", label: "General Onboarding" },
  { value: "Salesforce Academy", label: "Salesforce Academy" },
  { value: "Travel Advisors", label: "Travel Advisors" },
  { value: "Operations", label: "Operations" },
  { value: "Best Practices", label: "Best Practices" },
];

const TRACKS: { value: LmsTrack; label: string }[] = [
  { value: "general", label: "General" },
  { value: "travel_advisor", label: "Travel Advisor" },
  { value: "operations", label: "Operations" },
  { value: "both", label: "Both" },
];

const COMPLETION_RULES: { value: CompletionRule; label: string }[] = [
  { value: "all_lessons", label: "All Chapters Completed" },
  { value: "all_quizzes", label: "All Quizzes Passed" },
  { value: "min_score", label: "Minimum Quiz Score" },
  { value: "manual", label: "Manual Completion" },
];

type Tab = "settings" | "modules" | "quizzes" | "enrollments";

export default function CourseBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const isCreator = isCourseCreator(session?.user?.email);

  const [course, setCourse] = useState<Course | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Settings form state
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [category, setCategory] = useState("General Onboarding");
  const [tracks, setTracks] = useState<LmsTrack[]>(["general"]);
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [completionRule, setCompletionRule] =
    useState<CompletionRule>("all_lessons");
  const [minScorePct, setMinScorePct] = useState<number>(70);
  const [isSequential, setIsSequential] = useState(true);
  const [prerequisiteIds, setPrerequisiteIds] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [dueDaysAfterEnrollment, setDueDaysAfterEnrollment] = useState<number | null>(null);

  const loadCourse = useCallback(async () => {
    setLoading(true);
    try {
      const [detail, courses] = await Promise.all([
        fetchCourseDetail(courseId),
        fetchCourses(),
      ]);
      if (detail) {
        setCourse(detail);
        setTitle(detail.title);
        setCode(detail.code);
        setDescription(detail.description || "");
        setThumbnailUrl(detail.thumbnail_url || "");
        setCategory(detail.category);
        setTracks(detail.tracks);
        setEstimatedMinutes(detail.estimated_minutes);
        setCompletionRule(detail.completion_rule);
        setMinScorePct(detail.min_score_pct ?? 70);
        setIsSequential(detail.is_sequential);
        setPrerequisiteIds(detail.prerequisite_ids || []);
        setIsPublished(detail.is_published);
        setDueDaysAfterEnrollment(detail.due_days_after_enrollment ?? null);
      }
      setAllCourses(courses.filter((c) => c.id !== courseId));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (status === "authenticated" && isCreator) {
      loadCourse();
    }
  }, [status, isCreator, loadCourse]);

  if (status === "loading" || loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen bg-[#eeeeee]">
          <div className="w-8 h-8 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!isCreator) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen bg-[#eeeeee]">
          <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-8 text-center max-w-sm">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8ECF1"
              strokeWidth="1.5"
              className="mx-auto mb-3"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h2 className="text-base font-semibold text-[#304256] mb-1">
              Access denied
            </h2>
            <p className="text-sm text-gray-500">
              You do not have permission to edit courses.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen bg-[#eeeeee]">
          <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-8 text-center max-w-sm">
            <h2 className="text-base font-semibold text-[#304256] mb-1">
              Course not found
            </h2>
            <p className="text-sm text-gray-500">
              This course may have been deleted.
            </p>
            <button
              onClick={() => router.push("/learn/admin")}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch("/api/learn/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: courseId,
          title: title.trim(),
          code: code.trim(),
          description: description.trim() || null,
          thumbnail_url: thumbnailUrl.trim() || null,
          category,
          tracks,
          estimated_minutes: estimatedMinutes,
          completion_rule: completionRule,
          min_score_pct: completionRule === "min_score" ? minScorePct : null,
          is_sequential: isSequential,
          is_published: isPublished,
          due_days_after_enrollment: dueDaysAfterEnrollment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      // Save prerequisites
      await fetch("/api/learn/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: courseId,
          _update_prerequisites: true,
          prerequisite_ids: prerequisiteIds,
        }),
      });

      setSaveMsg("Settings saved");
      setTimeout(() => setSaveMsg(null), 2000);
      loadCourse();
    } catch (e: unknown) {
      setSaveMsg(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggleTrack = (track: LmsTrack) => {
    setTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    );
  };

  const togglePrerequisite = (prereqId: string) => {
    setPrerequisiteIds((prev) =>
      prev.includes(prereqId)
        ? prev.filter((id) => id !== prereqId)
        : [...prev, prereqId]
    );
  };

  // Get quiz-type lessons
  const quizLessons: (Lesson & { moduleName: string })[] = [];
  for (const mod of course.modules || []) {
    for (const lesson of mod.lessons || []) {
      if (lesson.lesson_type === "quiz") {
        quizLessons.push({ ...lesson, moduleName: mod.title });
      }
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "settings", label: "Settings" },
    { key: "modules", label: "Modules & Lessons" },
    { key: "quizzes", label: "Quizzes" },
    { key: "enrollments", label: "Enrollments" },
  ];

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/learn/admin")}
              className="text-gray-400 hover:text-[#304256] transition-colors"
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
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[#304256] truncate">
                {course.title}
              </h1>
              <p className="text-xs text-gray-400 font-mono">{course.code}</p>
            </div>
            <span
              className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                course.is_published
                  ? "bg-[#27a28c]/10 text-[#27a28c]"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {course.is_published ? "Published" : "Draft"}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white border border-[#E8ECF1] rounded-xl p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#27a28c] text-white"
                    : "text-gray-500 hover:text-[#304256] hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                />
              </div>

              {/* Code */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  ref={(el) => {
                    if (el) {
                      el.style.height = "auto";
                      el.style.height = el.scrollHeight + "px";
                    }
                  }}
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] resize-none overflow-hidden"
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Thumbnail
                </label>
                <div className="flex gap-3 items-start">
                  {thumbnailUrl && (
                    <img src={thumbnailUrl} alt="Thumbnail" className="w-20 h-14 object-cover rounded-lg border border-[#E8ECF1] flex-shrink-0" />
                  )}
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <label className={`px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${uploadingThumb ? "bg-gray-100 text-gray-400" : "bg-[#27a28c] text-white hover:bg-[#27a28c]/90"}`}>
                        {uploadingThumb ? "Uploading..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          className="hidden"
                          disabled={uploadingThumb}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingThumb(true);
                            try {
                              const formData = new FormData();
                              formData.append("file", file);
                              const res = await fetch("/api/wiki/upload", { method: "POST", body: formData });
                              if (res.ok) {
                                const { url } = await res.json();
                                setThumbnailUrl(url);
                              }
                            } catch { /* ignore */ } finally {
                              setUploadingThumb(false);
                              e.target.value = "";
                            }
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-gray-300 self-center">or</span>
                    </div>
                    <input
                      type="text"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full px-3 py-2 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tracks */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Tracks
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRACKS.map((t) => (
                    <label
                      key={t.value}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        tracks.includes(t.value)
                          ? "border-[#27a28c] bg-[#27a28c]/5"
                          : "border-[#E8ECF1] bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={tracks.includes(t.value)}
                        onChange={() => toggleTrack(t.value)}
                        className="w-3.5 h-3.5 rounded text-[#27a28c] focus:ring-[#27a28c]"
                      />
                      <span className="text-sm text-[#304256]">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Estimated Minutes */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Estimated Minutes
                </label>
                <input
                  type="number"
                  min={0}
                  value={estimatedMinutes}
                  onChange={(e) =>
                    setEstimatedMinutes(Number(e.target.value))
                  }
                  className="w-32 px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                />
              </div>

              {/* Due Days After Enrollment */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Due Date (days after enrollment)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={dueDaysAfterEnrollment ?? ""}
                    onChange={(e) =>
                      setDueDaysAfterEnrollment(e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="No deadline"
                    className="w-32 px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                  />
                  <span className="text-xs text-gray-400">days</span>
                  {dueDaysAfterEnrollment && (
                    <button
                      onClick={() => setDueDaysAfterEnrollment(null)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Auto-sets a due date when a learner enrolls. Leave blank for no deadline.
                </p>
              </div>

              {/* Completion Rule */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Completion Rule
                </label>
                <select
                  value={completionRule}
                  onChange={(e) =>
                    setCompletionRule(e.target.value as CompletionRule)
                  }
                  className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white"
                >
                  {COMPLETION_RULES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Score (conditional) */}
              {completionRule === "min_score" && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Minimum Score (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={minScorePct}
                    onChange={(e) => setMinScorePct(Number(e.target.value))}
                    className="w-32 px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                  />
                </div>
              )}

              {/* Sequential */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSequential}
                    onChange={(e) => setIsSequential(e.target.checked)}
                    className="w-4 h-4 rounded text-[#27a28c] focus:ring-[#27a28c]"
                  />
                  <span className="text-sm text-[#304256]">
                    Sequential (learners must complete lessons in order)
                  </span>
                </label>
              </div>

              {/* Prerequisites */}
              {allCourses.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Prerequisites
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allCourses.map((c) => (
                      <label
                        key={c.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-xs ${
                          prerequisiteIds.includes(c.id)
                            ? "border-[#27a28c] bg-[#27a28c]/5"
                            : "border-[#E8ECF1] bg-white hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={prerequisiteIds.includes(c.id)}
                          onChange={() => togglePrerequisite(c.id)}
                          className="w-3.5 h-3.5 rounded text-[#27a28c] focus:ring-[#27a28c]"
                        />
                        <span className="text-[#304256]">{c.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Published */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#27a28c] focus:ring-[#27a28c]"
                  />
                  <span className="text-sm text-[#304256]">
                    Published (visible to learners)
                  </span>
                </label>
              </div>

              {/* Save */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                {saveMsg && (
                  <span
                    className={`text-sm ${
                      saveMsg === "Settings saved"
                        ? "text-[#27a28c]"
                        : "text-red-500"
                    }`}
                  >
                    {saveMsg}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Modules & Lessons Tab */}
          {activeTab === "modules" && (
            <ModuleLessonBuilder
              courseId={courseId}
              modules={course.modules || []}
              onRefresh={loadCourse}
            />
          )}

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div className="space-y-6">
              {quizLessons.length === 0 ? (
                <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-8 text-center">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E8ECF1"
                    strokeWidth="1.5"
                    className="mx-auto mb-3"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm text-gray-500">
                    No quiz lessons yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add a lesson with type &quot;Quiz&quot; in the Modules
                    tab first
                  </p>
                </div>
              ) : (
                quizLessons.map((lesson) => (
                  <div key={lesson.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-gray-400">
                        {lesson.moduleName}
                      </span>
                      <span className="text-gray-300">/</span>
                      <span className="text-sm font-semibold text-[#304256]">
                        {lesson.title}
                      </span>
                    </div>
                    <QuizBuilder
                      quizId={lesson.id}
                      onSave={loadCourse}
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Enrollments Tab */}
          {activeTab === "enrollments" && (
            <EnrollmentManager courseId={courseId} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
