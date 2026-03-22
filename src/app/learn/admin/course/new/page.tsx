"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import CourseTemplates from "@/components/CourseTemplates";
import { isCourseCreator } from "@/lib/admin";
import type { CourseTemplate, LmsTrack, CompletionRule, LessonType } from "@/types";

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

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export default function CreateCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isCreator = isCourseCreator(session?.user?.email);

  const [step, setStep] = useState<"template" | "form">("template");
  const [selectedTemplate, setSelectedTemplate] =
    useState<CourseTemplate | null>(null);
  const [cloneCourseId, setCloneCourseId] = useState<string | undefined>();

  // Form state
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General Onboarding");
  const [tracks, setTracks] = useState<LmsTrack[]>(["general"]);
  const [completionRule, setCompletionRule] =
    useState<CompletionRule>("all_lessons");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
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
              You do not have permission to create courses.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleTemplateSelect = (
    template: CourseTemplate | null,
    cloneId?: string
  ) => {
    setSelectedTemplate(template);
    setCloneCourseId(cloneId);

    if (cloneId) {
      // Clone flow: go straight to API
      handleClone(cloneId);
    } else {
      // Template or blank: show form
      if (template) {
        setCategory(template.category);
      }
      setStep("form");
    }
  };

  const handleClone = async (courseId: string) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/learn/courses/${courseId}/clone`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to clone course");
      }
      const newCourse = await res.json();
      router.push(`/learn/admin/course/${newCourse.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to clone");
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    setError(null);
    try {
      const courseCode = code.trim() || slugify(title);

      // 1. Create course
      const res = await fetch("/api/learn/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: courseCode,
          title: title.trim(),
          description: description.trim() || null,
          category,
          tracks,
          completion_rule: completionRule,
          is_published: false,
          is_sequential: true,
          estimated_minutes: 0,
          sort_order: 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create course");
      }

      const newCourse = await res.json();

      // 2. If template selected, create modules and lessons from template
      if (selectedTemplate && selectedTemplate.modules.length > 0) {
        for (let mIdx = 0; mIdx < selectedTemplate.modules.length; mIdx++) {
          const tmpl = selectedTemplate.modules[mIdx];
          const modRes = await fetch("/api/learn/modules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              course_id: newCourse.id,
              title: tmpl.title,
              sort_order: mIdx,
            }),
          });

          if (!modRes.ok) continue;
          const newModule = await modRes.json();

          for (let lIdx = 0; lIdx < tmpl.lessons.length; lIdx++) {
            const lessonTmpl = tmpl.lessons[lIdx];
            await fetch("/api/learn/lessons", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                module_id: newModule.id,
                title: lessonTmpl.title,
                lesson_type: lessonTmpl.type as LessonType,
                sort_order: lIdx,
              }),
            });
          }
        }
      }

      router.push(`/learn/admin/course/${newCourse.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create course");
      setSaving(false);
    }
  };

  const toggleTrack = (track: LmsTrack) => {
    setTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    );
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() =>
                step === "form" && !cloneCourseId
                  ? setStep("template")
                  : router.push("/learn/admin")
              }
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
            <h1 className="text-xl font-bold text-[#304256]">
              {step === "template" ? "Create Course" : "Course Details"}
            </h1>
          </div>

          {/* Template selection step */}
          {step === "template" && (
            <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-6">
              <CourseTemplates onSelect={handleTemplateSelect} />
            </div>
          )}

          {/* Form step */}
          {step === "form" && (
            <form onSubmit={handleSubmit}>
              <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-6 space-y-5">
                {selectedTemplate && (
                  <div className="px-3 py-2 bg-[#27a28c]/5 border border-[#27a28c]/20 rounded-lg">
                    <p className="text-xs text-[#27a28c] font-medium">
                      Using template: {selectedTemplate.name}
                    </p>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!code) {
                        // Auto-generate code hint
                      }
                    }}
                    placeholder="e.g. Salesforce Basics"
                    required
                    className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] transition-colors"
                  />
                </div>

                {/* Code */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={
                      title ? slugify(title) : "auto-generated from title"
                    }
                    className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] font-mono transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the course..."
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] resize-none transition-colors"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white transition-colors"
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
                    className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white transition-colors"
                  >
                    {COMPLETION_RULES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/learn/admin")}
                    className="px-4 py-2.5 text-sm text-gray-500 hover:text-[#304256] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !title.trim()}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Creating..." : "Create Course"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Loading state for clone */}
          {saving && cloneCourseId && (
            <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Cloning course...</p>
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
