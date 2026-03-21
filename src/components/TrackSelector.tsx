"use client";

import type { LmsTrack } from "@/types";

interface TrackSelectorProps {
  selected: LmsTrack | null;
  onSelect: (track: LmsTrack) => void;
}

const tracks: {
  value: LmsTrack;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "general",
    title: "General",
    description: "Core TC knowledge for all team members",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-5" />
      </svg>
    ),
  },
  {
    value: "travel_advisor",
    title: "Travel Advisor",
    description: "Client-facing advisory skills + Salesforce Advisor Cloud",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    value: "operations",
    title: "Operations",
    description: "Back-office processes + Salesforce Operations Cloud",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    value: "both",
    title: "Both TA + Ops",
    description: "Complete curriculum for hybrid roles",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

export default function TrackSelector({
  selected,
  onSelect,
}: TrackSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tracks.map((track) => {
        const isSelected = selected === track.value;
        return (
          <button
            key={track.value}
            onClick={() => onSelect(track.value)}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
              isSelected
                ? "border-[#27a28c] bg-[#27a28c]/5 shadow-sm"
                : "border-[#E8ECF1] bg-white hover:border-gray-300"
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                isSelected
                  ? "bg-[#27a28c] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {track.icon}
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  isSelected ? "text-[#27a28c]" : "text-[#304256]"
                }`}
              >
                {track.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {track.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
