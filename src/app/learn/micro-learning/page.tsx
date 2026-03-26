"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useBrand } from "@/lib/brand-context";
import type { MicroLesson } from "@/types";

export default function MicroLearningGallery() {
  const router = useRouter();
  const { brand } = useBrand();
  const [lessons, setLessons] = useState<MicroLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const brandParam = brand.mode === "tc" ? "tc" : brand.mode;
    fetch(`/api/learn/micro-lessons?brand=${encodeURIComponent(brandParam)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLessons(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [brand.mode]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    lessons.forEach((l) => l.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [lessons]);

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        (l.description || "").toLowerCase().includes(q) ||
        l.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesTag = !selectedTag || l.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [lessons, search, selectedTag]);

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">&#9889;</span>
                <h1 className="text-2xl font-bold text-[#304256]">Micro-Learning</h1>
              </div>
              <p className="text-sm text-gray-500">Short ~5 min video lessons to level up your skills</p>
            </div>
            <button
              onClick={() => router.push("/learn")}
              className="px-4 py-2 text-xs font-medium text-[#304256] border border-[#E8ECF1] rounded-lg hover:bg-white transition-colors"
            >
              Back to Learn
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search lessons by title, description, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#E8ECF1] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c]"
              />
            </div>
          </div>

          {/* Tag filters */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  !selectedTag
                    ? "bg-[#27a28c] text-white"
                    : "bg-white text-gray-600 border border-[#E8ECF1] hover:bg-gray-50"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    selectedTag === tag
                      ? "bg-[#27a28c] text-white"
                      : "bg-white text-gray-600 border border-[#E8ECF1] hover:bg-gray-50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No micro-lessons found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => router.push(`/learn/micro-learning/${lesson.id}`)}
                  className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow text-left group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-[#304256] relative flex items-center justify-center">
                    {(() => {
                      const driveMatch = lesson.video_url?.match(/\/d\/([^/]+)/);
                      const thumbSrc = lesson.thumbnail_url || (driveMatch ? `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w400` : "");
                      return thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={lesson.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-white/30">
                          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                        </svg>
                      );
                    })()}
                    {/* Duration badge */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>&#9889;</span> 5 min
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#304256">
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-[#304256] mb-1 line-clamp-2">
                      {lesson.title}
                    </h3>
                    {lesson.description && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{lesson.description}</p>
                    )}
                    {lesson.tags && lesson.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {lesson.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-full"
                            style={{ backgroundColor: "#e0f7f3", color: "#27a28c" }}
                          >
                            {tag}
                          </span>
                        ))}
                        {lesson.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-[10px] text-gray-400">+{lesson.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
