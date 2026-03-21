"use client";

interface CourseBadgeProps {
  courseName: string;
  completedAt: string;
  userName?: string;
  category?: string;
}

export default function CourseBadge({
  courseName,
  completedAt,
  userName,
  category,
}: CourseBadgeProps) {
  const formattedDate = new Date(completedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      {/* Top accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#27a28c] via-[#1a7a6a] to-[#27a28c]" />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#304256] via-[#1e3044] to-[#0F1923] px-5 pt-6 pb-8 text-center overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }} />
        <div className="absolute top-3 left-3 w-12 h-12 border border-white/[0.06] rounded-full" />
        <div className="absolute top-1 left-1 w-20 h-20 border border-white/[0.03] rounded-full" />
        <div className="absolute bottom-3 right-3 w-10 h-10 border border-white/[0.06] rounded-full" />
        <div className="absolute bottom-1 right-1 w-16 h-16 border border-white/[0.03] rounded-full" />

        {/* Medal */}
        <div className="relative mx-auto mb-3 w-14 h-14 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#27a28c]/30 to-[#27a28c]/10" />
          <div className="absolute inset-1 rounded-full bg-gradient-to-b from-[#27a28c]/20 to-transparent" />
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="relative z-10"
          >
            <circle cx="12" cy="9" r="6" stroke="#27a28c" strokeWidth="1.5" />
            <path d="M8.5 13.5L7 22l5-2.5L17 22l-1.5-8.5" stroke="#27a28c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 6l1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 12l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L12 6z" fill="#27a28c" opacity="0.4" />
          </svg>
        </div>

        <p className="relative text-white/50 text-[9px] font-semibold uppercase tracking-[0.2em]">
          Certificate of Completion
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col px-5 pt-5 pb-4 text-center">
        {/* Course name — flex-grow so it takes remaining space, pushing footer down */}
        <div className="flex-1 flex items-start justify-center mb-3">
          <h3 className="text-sm font-bold text-[#304256] leading-snug line-clamp-3">
            {courseName}
          </h3>
        </div>

        {userName && (
          <p className="text-xs text-gray-500 mb-2 font-medium">{userName}</p>
        )}

        {/* Date */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#27a28c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-[11px] font-medium text-[#27a28c]">
            {formattedDate}
          </span>
        </div>

        {/* Category tag */}
        {category && (
          <div className="mb-3">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-medium text-[#304256]/60 bg-[#304256]/[0.04] rounded-full">
              {category}
            </span>
          </div>
        )}

        {/* Footer divider + TC branding */}
        <div className="mt-auto pt-3 border-t border-[#E8ECF1]">
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#304256] to-[#0F1923] flex items-center justify-center">
              <span className="text-[6px] font-bold text-white">TC</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide">
              Travel Collection Academy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
