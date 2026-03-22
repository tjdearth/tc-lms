"use client";

import type { Lesson } from "@/types";

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
}

function parseVideoEmbed(url: string): string | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  // Google Drive
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  // Fallback: return URL as-is (may already be embeddable)
  return url;
}

export default function LessonContent({ lesson, onComplete }: LessonContentProps) {
  const isQuiz = lesson.lesson_type === "quiz";

  // Content type
  if (lesson.lesson_type === "content") {
    if (!lesson.html_content) {
      return (
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <p className="text-sm">No content yet.</p>
          </div>
          <MarkCompleteButton onComplete={onComplete} />
        </div>
      );
    }
    return (
      <div>
        <div
          className="scribe-content"
          dangerouslySetInnerHTML={{ __html: lesson.html_content }}
        />
        <MarkCompleteButton onComplete={onComplete} />
      </div>
    );
  }

  // Video type
  if (lesson.lesson_type === "video") {
    if (!lesson.video_url) {
      return (
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <p className="text-sm">No video URL configured.</p>
          </div>
          <MarkCompleteButton onComplete={onComplete} />
        </div>
      );
    }
    const embedUrl = parseVideoEmbed(lesson.video_url);
    return (
      <div>
        <div className="w-full">
          <div className="relative w-full pb-[56.25%] bg-black rounded-xl overflow-hidden">
            <iframe
              src={embedUrl || lesson.video_url}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        </div>
        <MarkCompleteButton onComplete={onComplete} />
      </div>
    );
  }

  // Wiki link type
  if (lesson.lesson_type === "wiki_link") {
    if (lesson.wiki_node?.html_content) {
      return (
        <div>
          <div
            className="scribe-content"
            dangerouslySetInnerHTML={{ __html: lesson.wiki_node.html_content }}
          />
          <MarkCompleteButton onComplete={onComplete} />
        </div>
      );
    }
    return (
      <div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
          <p className="text-sm">Wiki article not found</p>
        </div>
        <MarkCompleteButton onComplete={onComplete} />
      </div>
    );
  }

  // Quiz type - no "Mark as Complete" button; quiz player handles completion
  if (isQuiz) {
    return (
      <div className="bg-[#27a28c]/5 border border-[#27a28c]/20 rounded-xl p-8 text-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#27a28c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-3"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p className="text-sm font-medium text-[#304256]">
          This chapter contains a quiz
        </p>
        <p className="text-xs text-gray-500 mt-1 mb-4">
          Complete the quiz below to continue.
        </p>
        <button
          onClick={onComplete}
          className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return null;
}

function MarkCompleteButton({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="mt-6 pt-4 border-t border-[#E8ECF1]">
      <button
        onClick={onComplete}
        className="w-full py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors flex items-center justify-center gap-2"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Mark as Complete
      </button>
    </div>
  );
}
