"use client";

import type { Course, Enrollment } from "@/types";

interface CourseCardProps {
  course: Course;
  enrollment?: Enrollment;
  progressPct?: number;
  onClick?: () => void;
}

const categoryGradients: Record<string, string> = {
  general_onboarding: "from-[#27a28c] to-[#304256]",
  salesforce_academy: "from-[#0176d3] to-[#304256]",
  product_training: "from-[#E8A838] to-[#304256]",
  compliance: "from-[#d94f57] to-[#304256]",
};

const categoryLabels: Record<string, string> = {
  general_onboarding: "Onboarding",
  salesforce_academy: "Salesforce",
  product_training: "Product",
  compliance: "Compliance",
};

export default function CourseCard({
  course,
  enrollment,
  progressPct,
  onClick,
}: CourseCardProps) {
  const gradient =
    categoryGradients[course.category] || "from-[#304256] to-[#0F1923]";
  const categoryLabel =
    categoryLabels[course.category] || course.category.replace(/_/g, " ");
  const lessonCount = (course.modules || []).reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  );
  const rawPct = progressPct ?? course.progress_pct ?? 0;
  const pct = enrollment?.status === "completed" ? 100 : rawPct;

  const statusLabel =
    enrollment?.status === "completed"
      ? "Completed"
      : enrollment?.status === "in_progress"
      ? "In Progress"
      : enrollment
      ? "Enrolled"
      : null;

  const statusColor =
    enrollment?.status === "completed"
      ? "bg-[#27a28c]/10 text-[#27a28c]"
      : enrollment?.status === "in_progress"
      ? "bg-amber-50 text-amber-600"
      : "bg-blue-50 text-blue-600";

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Thumbnail or gradient */}
      {course.thumbnail_url ? (
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-36 object-cover"
        />
      ) : (
        <div
          className={`w-full h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-40"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Category + status row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium bg-[#27a28c]/10 text-[#27a28c] rounded-full capitalize">
            {categoryLabel}
          </span>
          {statusLabel && (
            <span
              className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full ${statusColor}`}
            >
              {statusLabel}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-[#304256] mb-1 line-clamp-1">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1" title={course.description || ""}>
          {course.description || "No description"}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {course.estimated_minutes} min
          </span>
          <span className="flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            {lessonCount} lesson{lessonCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Progress bar if enrolled */}
        {enrollment ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-gray-500">
                {enrollment.status === "completed"
                  ? "Completed"
                  : `${pct}% complete`}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E8ECF1] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#27a28c] rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            className="w-full py-2 text-xs font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Enrol
          </button>
        )}
      </div>
    </div>
  );
}
