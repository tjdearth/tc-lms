"use client";

interface CourseProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  textColor?: string;
  trackColor?: string;
}

export default function CourseProgress({
  percent,
  size = 48,
  strokeWidth = 4,
  className = "",
  textColor = "#304256",
  trackColor = "#E8ECF1",
}: CourseProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;
  const center = size / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#27a28c"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-semibold" style={{ color: textColor }}>
        {Math.round(percent)}%
      </span>
    </div>
  );
}
