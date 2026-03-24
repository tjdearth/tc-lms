"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import CourseTemplates from "@/components/CourseTemplates";
import WikiNodePicker from "@/components/WikiNodePicker";
import { isCourseCreator } from "@/lib/admin";
import type { CourseTemplate, LmsTrack, CompletionRule, LessonType } from "@/types";

const CATEGORIES = [
  { value: "General Onboarding", label: "General Onboarding" },
  { value: "Salesforce Academy", label: "Salesforce Academy" },
  { value: "Travel Advisors", label: "Travel Advisors" },
  { value: "Operations", label: "Operations" },
  { value: "Best Practices", label: "Best Practices" },
  { value: "Business Development", label: "Business Development" },
  { value: "Finance", label: "Finance" },
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

  const [step, setStep] = useState<"template" | "form" | "ai">("template");
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

  // AI generation state
  const [aiTopic, setAiTopic] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiCategory, setAiCategory] = useState("General Onboarding");
  const [aiTracks, setAiTracks] = useState<LmsTrack[]>(["general"]);
  const [aiDifficulty, setAiDifficulty] = useState("Intermediate");
  const [aiNumModules, setAiNumModules] = useState(3);
  const [aiIncludeQuizzes, setAiIncludeQuizzes] = useState(true);
  const [aiWikiNodes, setAiWikiNodes] = useState<{ id: string; title: string }[]>([]);
  const [aiReferenceUrls, setAiReferenceUrls] = useState<string[]>([""]);
  const [aiReferenceFiles, setAiReferenceFiles] = useState<{ name: string; content: string }[]>([]);
  const [aiInstructions, setAiInstructions] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState("");
  const [wikiPickerOpen, setWikiPickerOpen] = useState(false);
  const aiAbortRef = useRef<AbortController | null>(null);

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
    } else if (template && template.name === "__ai__") {
      // AI Generate flow
      setStep("ai");
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

  const toggleAiTrack = (track: LmsTrack) => {
    setAiTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    );
  };

  const handleAddUrl = () => {
    setAiReferenceUrls((prev) => [...prev, ""]);
  };

  const handleRemoveUrl = (idx: number) => {
    setAiReferenceUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUrlChange = (idx: number, value: string) => {
    setAiReferenceUrls((prev) =>
      prev.map((u, i) => (i === idx ? value : u))
    );
  };

  const handleRemoveWikiNode = (id: string) => {
    setAiWikiNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setAiReferenceFiles((prev) => [
          ...prev,
          { name: file.name, content: text },
        ]);
      };
      reader.readAsText(file);
    });
    e.target.value = "";
  };

  const handleRemoveFile = (idx: number) => {
    setAiReferenceFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAiCancel = () => {
    if (aiAbortRef.current) {
      aiAbortRef.current.abort();
      aiAbortRef.current = null;
    }
    setAiGenerating(false);
    setAiProgress("");
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) return;
    setAiGenerating(true);
    setError(null);
    setAiProgress("Preparing course generation...");

    const controller = new AbortController();
    aiAbortRef.current = controller;

    try {
      setAiProgress("AI is generating your course structure and content. This may take 30-60 seconds...");

      const urls = aiReferenceUrls.filter((u) => u.trim());
      const res = await fetch("/api/learn/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          description: aiDescription.trim() || undefined,
          category: aiCategory,
          tracks: aiTracks,
          difficulty: aiDifficulty,
          numModules: aiNumModules,
          includeQuizzes: aiIncludeQuizzes,
          wikiNodeIds: aiWikiNodes.map((n) => n.id),
          referenceUrls: urls.length > 0 ? urls : undefined,
          referenceFiles: aiReferenceFiles.length > 0 ? aiReferenceFiles : undefined,
          additionalInstructions: aiInstructions.trim() || undefined,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate course");
      }

      setAiProgress("Course created! Redirecting...");
      const data = await res.json();
      router.push(`/learn/admin/course/${data.courseId}`);
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === "AbortError") {
        setAiProgress("");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to generate course");
      setAiGenerating(false);
      setAiProgress("");
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() =>
                (step === "form" || step === "ai") && !cloneCourseId
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
              {step === "template"
                ? "Create Course"
                : step === "ai"
                ? "AI Course Generator"
                : "Course Details"}
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

          {/* AI Generate step */}
          {step === "ai" && (
            <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-6 space-y-5">
              <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-700 font-medium">
                  AI will generate a complete course with modules, lessons, and optional quizzes
                </p>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Topic *
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Salesforce Lead Management, Kenya Safari Operations"
                  className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Description
                  <span className="text-gray-400 font-normal ml-1">(recommended)</span>
                </label>
                <textarea
                  value={aiDescription}
                  onChange={(e) => {
                    setAiDescription(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  placeholder="Describe what this course should cover, the learning objectives, and any specific topics to include..."
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
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
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
                        aiTracks.includes(t.value)
                          ? "border-[#27a28c] bg-[#27a28c]/5"
                          : "border-[#E8ECF1] bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={aiTracks.includes(t.value)}
                        onChange={() => toggleAiTrack(t.value)}
                        className="w-3.5 h-3.5 rounded text-[#27a28c] focus:ring-[#27a28c]"
                      />
                      <span className="text-sm text-[#304256]">
                        {t.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty & Modules row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white transition-colors"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Number of Modules
                  </label>
                  <select
                    value={aiNumModules}
                    onChange={(e) => setAiNumModules(Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white transition-colors"
                  >
                    {[2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} modules
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Include Quizzes */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiIncludeQuizzes}
                  onChange={(e) => setAiIncludeQuizzes(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#27a28c] focus:ring-[#27a28c]"
                />
                <span className="text-sm text-[#304256]">
                  Include quizzes at the end of each module
                </span>
              </label>

              {/* Wiki references */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Reference Wiki Articles
                </label>
                {aiWikiNodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {aiWikiNodes.map((node) => (
                      <span
                        key={node.id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#27a28c]/10 text-[#27a28c] rounded-full border border-[#27a28c]/20 font-medium"
                      >
                        {node.title}
                        <button
                          type="button"
                          onClick={() => handleRemoveWikiNode(node.id)}
                          disabled={aiGenerating}
                          className="hover:text-[#304256] disabled:opacity-50"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setWikiPickerOpen(true)}
                  disabled={aiGenerating}
                  className="px-3 py-2 text-sm border border-dashed border-[#E8ECF1] rounded-lg text-gray-500 hover:text-[#304256] hover:border-gray-300 transition-colors disabled:opacity-50"
                >
                  + Add Wiki Article
                </button>
              </div>

              {/* Reference URLs */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Reference URLs
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                {aiReferenceUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(idx, e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] transition-colors"
                    />
                    {aiReferenceUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(idx)}
                        className="px-2 text-gray-400 hover:text-red-500"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="text-xs text-[#27a28c] hover:underline"
                >
                  + Add another URL
                </button>
              </div>

              {/* Reference Files */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Reference Files (HTML)
                </label>
                {aiReferenceFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {aiReferenceFiles.map((file, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full border border-gray-200 font-medium"
                      >
                        {file.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          disabled={aiGenerating}
                          className="hover:text-red-500 disabled:opacity-50"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept=".html,.htm"
                  multiple
                  onChange={handleFileUpload}
                  disabled={aiGenerating}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border file:border-dashed file:border-[#E8ECF1] file:text-sm file:bg-white file:text-gray-500 hover:file:border-gray-300 file:cursor-pointer disabled:opacity-50"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Upload saved web pages (.html) for content Claude can&apos;t access directly — like dashboards or internal tools
                </p>
              </div>

              {/* Additional Instructions */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Additional Instructions
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  placeholder="Any specific requirements, tone preferences, or content to emphasize..."
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] resize-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {aiProgress && (
                <div className="flex items-center gap-3 px-3 py-2 bg-[#27a28c]/5 border border-[#27a28c]/20 rounded-lg">
                  <div className="w-4 h-4 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <p className="text-xs text-[#27a28c]">{aiProgress}</p>
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={aiGenerating ? handleAiCancel : () => setStep("template")}
                  className={`px-4 py-2.5 text-sm transition-colors ${aiGenerating ? "text-red-500 hover:text-red-700 font-medium" : "text-gray-500 hover:text-[#304256]"}`}
                >
                  {aiGenerating ? "Stop Generating" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={aiGenerating || !aiTopic.trim()}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
                >
                  {aiGenerating ? "Generating..." : "Generate Course"}
                </button>
              </div>
            </div>
          )}

          {/* Wiki Node Picker Modal */}
          <WikiNodePicker
            isOpen={wikiPickerOpen}
            onClose={() => setWikiPickerOpen(false)}
            onSelect={(nodeId, nodeTitle) => {
              if (!aiWikiNodes.some((n) => n.id === nodeId)) {
                setAiWikiNodes((prev) => [...prev, { id: nodeId, title: nodeTitle }]);
              }
            }}
          />

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
