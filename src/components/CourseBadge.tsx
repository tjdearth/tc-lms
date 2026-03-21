"use client";

interface CourseBadgeProps {
  courseName: string;
  completedAt: string;
  userName?: string;
}

export default function CourseBadge({
  courseName,
  completedAt,
  userName,
}: CourseBadgeProps) {
  const formattedDate = new Date(completedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden max-w-sm">
      {/* Gradient accent border top */}
      <div className="h-1 bg-gradient-to-r from-[#27a28c] via-[#304256] to-[#27a28c]" />

      {/* Navy gradient header */}
      <div className="bg-gradient-to-br from-[#304256] to-[#0F1923] px-6 py-5 text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-8 h-8 border border-white/10 rounded-full" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border border-white/10 rounded-full" />

        {/* Star/medal icon */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-2 opacity-80"
        >
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
        <p className="text-white/70 text-[10px] font-medium uppercase tracking-widest">
          Certificate of Completion
        </p>
      </div>

      {/* White body */}
      <div className="px-6 py-5 text-center">
        <h3 className="text-base font-bold text-[#304256] mb-1">
          {courseName}
        </h3>

        {userName && (
          <p className="text-sm text-gray-500 mb-2">{userName}</p>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[#27a28c] mb-3">
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-xs font-medium">
            Completed {formattedDate}
          </span>
        </div>

        <span className="inline-block px-3 py-1 text-xs font-medium text-[#27a28c] bg-[#27a28c]/10 rounded-full">
          Completed
        </span>

        {/* TC logo placeholder */}
        <div className="mt-3 pt-3 border-t border-[#E8ECF1]">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            Travel Collection
          </p>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-[#27a28c] via-[#304256] to-[#27a28c]" />
    </div>
  );
}
