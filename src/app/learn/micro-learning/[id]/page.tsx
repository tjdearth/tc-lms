"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import type { MicroLesson } from "@/types";

function toEmbedUrl(url: string): string {
  // Convert Google Drive /view URLs to /preview for iframe embedding
  const match = url.match(/\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

export default function MicroLessonViewer() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [lesson, setLesson] = useState<MicroLesson | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetch("/api/learn/micro-lessons")
      .then((r) => r.json())
      .then((data: MicroLesson[]) => {
        const found = data.find((l) => l.id === id);
        setLesson(found || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!lesson) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Micro-lesson not found</p>
            <button
              onClick={() => router.push("/learn/micro-learning")}
              className="px-4 py-2 text-xs font-medium text-white bg-[#304256] rounded-lg"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Back button */}
          <button
            onClick={() => router.push("/learn/micro-learning")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#304256] mb-6 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Micro-Learning
          </button>

          {/* Title and badge */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-full" style={{ backgroundColor: "#e0f7f3", color: "#27a28c" }}>
                  &#9889; 5 min lesson
                </span>
              </div>
              <h1 className="text-xl font-bold text-[#304256]">{lesson.title}</h1>
              {lesson.description && (
                <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 text-[11px] font-medium rounded-full"
                  style={{ backgroundColor: "#e0f7f3", color: "#27a28c" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Video player */}
          <div className="bg-black rounded-xl overflow-hidden mb-8 shadow-lg">
            <div className="aspect-video">
              <iframe
                src={toEmbedUrl(lesson.video_url)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          </div>

          {/* Key points */}
          {lesson.key_points_html && (
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="text-base font-semibold text-[#304256] mb-4">Key Points</h2>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.key_points_html }}
              />
            </div>
          )}

          {/* Related wiki article */}
          {lesson.wiki_article_id && (
            <a
              href={`/wiki?article=${lesson.wiki_article_id}`}
              className="flex items-center gap-3 bg-white border border-[#E8ECF1] rounded-xl p-4 mb-6 shadow-sm hover:border-[#27a28c]/30 hover:shadow-md transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#27a28c]/10 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Related Wiki Article</p>
                <p className="text-sm font-semibold text-[#304256] group-hover:text-[#27a28c] transition-colors truncate">Read full article &rarr;</p>
              </div>
            </a>
          )}

          {/* Transcript hidden — used only for AI search, not displayed */}
        </div>
      </div>
    </AppShell>
  );
}
