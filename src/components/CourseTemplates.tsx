"use client";

import { useState, useEffect } from "react";
import { COURSE_TEMPLATES } from "@/lib/learn-api";
import type { CourseTemplate, Course } from "@/types";

interface CourseTemplatesProps {
  onSelect: (template: CourseTemplate | null, cloneCourseId?: string) => void;
}

type SelectionMode = "template" | "clone" | "blank" | "ai";

export default function CourseTemplates({ onSelect }: CourseTemplatesProps) {
  const [mode, setMode] = useState<SelectionMode | null>(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<CourseTemplate | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCloneId, setSelectedCloneId] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    if (mode === "clone") {
      setLoadingCourses(true);
      fetch("/api/learn/courses")
        .then((r) => r.json())
        .then((data) => {
          setCourses(Array.isArray(data) ? data : []);
        })
        .finally(() => setLoadingCourses(false));
    }
  }, [mode]);

  const templates = COURSE_TEMPLATES.filter(
    (t) => t.modules.length > 0
  );

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const totalLessons = (t: CourseTemplate) =>
    t.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const handleConfirm = () => {
    if (mode === "blank") {
      onSelect(null);
    } else if (mode === "template" && selectedTemplate) {
      onSelect(selectedTemplate);
    } else if (mode === "clone" && selectedCloneId) {
      onSelect(null, selectedCloneId);
    } else if (mode === "ai") {
      onSelect({ name: "__ai__", description: "", category: "", modules: [] });
    }
  };

  const canConfirm =
    mode === "blank" ||
    (mode === "template" && selectedTemplate) ||
    (mode === "clone" && selectedCloneId) ||
    mode === "ai";

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-[#304256]">
        How would you like to start?
      </h3>

      {/* Mode selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Blank */}
        <button
          onClick={() => {
            setMode("blank");
            setSelectedTemplate(null);
            setSelectedCloneId(null);
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            mode === "blank"
              ? "border-[#27a28c] bg-[#27a28c]/5"
              : "border-[#E8ECF1] bg-white hover:border-gray-300"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#304256"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#304256]">Blank Course</p>
          <p className="text-xs text-gray-500 mt-0.5">Start from scratch</p>
        </button>

        {/* Template */}
        <button
          onClick={() => {
            setMode("template");
            setSelectedCloneId(null);
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            mode === "template"
              ? "border-[#27a28c] bg-[#27a28c]/5"
              : "border-[#E8ECF1] bg-white hover:border-gray-300"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-[#27a28c]/10 flex items-center justify-center mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#27a28c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#304256]">Use Template</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Pre-built course structure
          </p>
        </button>

        {/* Clone */}
        <button
          onClick={() => {
            setMode("clone");
            setSelectedTemplate(null);
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            mode === "clone"
              ? "border-[#27a28c] bg-[#27a28c]/5"
              : "border-[#E8ECF1] bg-white hover:border-gray-300"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#304256]">
            Clone Existing
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Copy an existing course
          </p>
        </button>

        {/* AI Generate */}
        <button
          onClick={() => {
            setMode("ai");
            setSelectedTemplate(null);
            setSelectedCloneId(null);
          }}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            mode === "ai"
              ? "border-[#27a28c] bg-[#27a28c]/5"
              : "border-[#E8ECF1] bg-white hover:border-gray-300"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#304256]">AI Generate</p>
          <p className="text-xs text-gray-500 mt-0.5">
            AI builds course content
          </p>
        </button>
      </div>

      {/* Template grid */}
      {mode === "template" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTemplate(template)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedTemplate?.name === template.name
                  ? "border-[#27a28c] bg-[#27a28c]/5"
                  : "border-[#E8ECF1] bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-sm font-semibold text-[#304256]">
                {template.name}
              </p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {template.description}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                <span>{template.modules.length} modules</span>
                <span>{totalLessons(template)} lessons</span>
                <span className="capitalize">
                  {template.category.replace(/_/g, " ")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Clone course picker */}
      {mode === "clone" && (
        <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E8ECF1]">
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full px-3 py-2 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loadingCourses ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredCourses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No courses found
              </p>
            ) : (
              filteredCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCloneId(course.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[#E8ECF1] last:border-b-0 transition-colors ${
                    selectedCloneId === course.id
                      ? "bg-[#27a28c]/5"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedCloneId === course.id
                        ? "border-[#27a28c]"
                        : "border-[#E8ECF1]"
                    }`}
                  >
                    {selectedCloneId === course.id && (
                      <div className="w-2 h-2 rounded-full bg-[#27a28c]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#304256] truncate">
                      {course.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {course.code} --{" "}
                      {course.category.replace(/_/g, " ")}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Confirm button */}
      {canConfirm && (
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
          >
            {mode === "blank"
              ? "Start Blank"
              : mode === "template"
              ? "Use Template"
              : mode === "ai"
              ? "Set Up AI Generator"
              : "Clone Course"}
          </button>
        </div>
      )}
    </div>
  );
}
