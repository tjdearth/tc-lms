"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { WikiNode, MicroLesson } from "@/types";
import { getAllArticles, buildBreadcrumb } from "@/lib/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: WikiNode) => void;
  onSelectMicroLesson?: (lesson: MicroLesson) => void;
  nodes: WikiNode[];
  microLessons?: MicroLesson[];
}

type SearchResult =
  | { kind: "wiki"; article: WikiNode; score: number; titleMatch: boolean; contentMatch: boolean }
  | { kind: "micro"; lesson: MicroLesson; score: number; titleMatch: boolean; contentMatch: boolean; snippet: string | null };

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-yellow-100 text-yellow-900 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

function getSnippet(searchText: string, query: string): string | null {
  if (!searchText || !query.trim()) return null;
  const lower = searchText.toLowerCase();
  const qLower = query.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return null;
  const start = Math.max(0, idx - 40);
  const end = Math.min(searchText.length, idx + query.length + 80);
  let snippet = searchText.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < searchText.length) snippet = snippet + "...";
  return snippet;
}

function ResultIcon({ type }: { type: string }) {
  if (type === "micro") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" className="flex-shrink-0">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  }
  if (type === "heading") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-gray-400">
        <path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M17 10l3 3-3 3" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-gray-400">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectMicroLesson,
  nodes,
  microLessons = [],
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const logTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLoggedQuery = useRef<string>("");
  const allArticles = useMemo(() => getAllArticles(nodes), [nodes]);

  // Log a search query to the analytics API
  const logSearch = useCallback((q: string, resultsCount: number, clickedId?: string) => {
    if (!q.trim()) return;
    fetch("/api/search-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q.trim(),
        source: "wiki_search",
        results_count: resultsCount,
        clicked_result_id: clickedId || null,
      }),
    }).catch(() => {});
  }, []);

  // Recent articles (last 6 with content, sorted by updated_at)
  const recentArticles = useMemo(() => {
    return [...allArticles]
      .filter((a) => a.html_content)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 6);
  }, [allArticles]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();

    const wikiResults: SearchResult[] = allArticles
      .map((a) => {
        const titleMatch = a.title.toLowerCase().includes(lower);
        const contentMatch = a.search_text?.toLowerCase().includes(lower) ?? false;
        if (!titleMatch && !contentMatch) return null;
        const score = titleMatch ? 2 : 1;
        return { kind: "wiki" as const, article: a, score, titleMatch, contentMatch };
      })
      .filter((r): r is Extract<SearchResult, { kind: "wiki" }> => r !== null);

    const microResults: SearchResult[] = microLessons
      .map((l) => {
        const titleMatch = l.title.toLowerCase().includes(lower);
        const descMatch = l.description?.toLowerCase().includes(lower) ?? false;
        const tagMatch = (l.tags || []).some((t) => t.toLowerCase().includes(lower));
        const transcript = l.transcript ? l.transcript.toLowerCase() : "";
        const keyPoints = l.key_points_html ? stripHtml(l.key_points_html).toLowerCase() : "";
        const transcriptMatch = transcript.includes(lower) || keyPoints.includes(lower);
        const contentMatch = descMatch || tagMatch || transcriptMatch;
        if (!titleMatch && !contentMatch) return null;

        // Snippet pulled from description or transcript
        let snippet: string | null = null;
        if (descMatch && l.description) {
          snippet = getSnippet(l.description, query);
        } else if (transcriptMatch) {
          snippet = getSnippet(l.transcript || stripHtml(l.key_points_html || ""), query);
        } else if (tagMatch) {
          snippet = `Tags: ${l.tags.join(", ")}`;
        }

        const score = titleMatch ? 2 : 1;
        return { kind: "micro" as const, lesson: l, score, titleMatch, contentMatch, snippet };
      })
      .filter((r): r is Extract<SearchResult, { kind: "micro" }> => r !== null);

    return [...wikiResults, ...microResults].sort((a, b) => b.score - a.score);
  }, [query, allArticles, microLessons]);

  // Debounced search logging — log when user stops typing for 1 second
  useEffect(() => {
    if (!query.trim() || query.trim() === lastLoggedQuery.current) return;
    if (logTimerRef.current) clearTimeout(logTimerRef.current);
    logTimerRef.current = setTimeout(() => {
      lastLoggedQuery.current = query.trim();
      logSearch(query, results.length);
    }, 1000);
    return () => {
      if (logTimerRef.current) clearTimeout(logTimerRef.current);
    };
  }, [query, results.length, logSearch]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIdx(0);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const selected = resultsRef.current.querySelector("[data-selected='true']");
    if (selected) {
      selected.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
      if (!isOpen) return;

      const hasQuery = !!query.trim();
      const listLength = hasQuery ? results.length : recentArticles.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, listLength - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter" && listLength > 0) {
        e.preventDefault();
        if (hasQuery) {
          const r = results[selectedIdx];
          if (r?.kind === "wiki") {
            onSelectArticle(r.article);
            onClose();
          } else if (r?.kind === "micro" && onSelectMicroLesson) {
            onSelectMicroLesson(r.lesson);
            onClose();
          }
        } else {
          const article = recentArticles[selectedIdx];
          if (article) {
            onSelectArticle(article);
            onClose();
          }
        }
      }
    },
    [isOpen, onClose, query, results, recentArticles, selectedIdx, onSelectArticle, onSelectMicroLesson]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const handleSelect = (article: WikiNode) => {
    // Log the click if there's an active search query
    if (query.trim()) {
      logSearch(query, results.length, article.id);
    }
    onSelectArticle(article);
    onClose();
  };

  const handleSelectMicro = (lesson: MicroLesson) => {
    if (query.trim()) {
      logSearch(query, results.length, lesson.id);
    }
    if (onSelectMicroLesson) {
      onSelectMicroLesson(lesson);
      onClose();
    }
  };

  const showRecent = !query.trim();
  const showResults = query.trim() && results.length > 0;
  const showEmpty = query.trim() && results.length === 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] md:pt-[12vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[640px] overflow-hidden border border-gray-200/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#27a28c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles, topics, guides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-[15px] outline-none placeholder:text-gray-400 min-w-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-300 hover:text-gray-500 p-0.5"
              aria-label="Clear"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </button>
          )}
          <kbd className="hidden md:inline text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Results area */}
        <div ref={resultsRef} className="max-h-[60vh] md:max-h-[420px] overflow-y-auto">
          {/* Recent articles (shown when no query) */}
          {showRecent && recentArticles.length > 0 && (
            <div className="py-2">
              <p className="px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Recently updated
              </p>
              {recentArticles.map((article, idx) => {
                const crumbs = buildBreadcrumb(nodes, article.id);
                const parentPath = crumbs.slice(0, -1).join(" / ");
                const isSelected = idx === selectedIdx;
                return (
                  <button
                    key={article.id}
                    data-selected={isSelected}
                    onClick={() => handleSelect(article)}
                    className={`w-full text-left px-5 py-2.5 flex items-start gap-3 transition-colors ${
                      isSelected ? "bg-accent/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="mt-0.5">
                      <ResultIcon type={article.node_type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${isSelected ? "text-accent" : "text-gray-800"}`}>
                        {article.title}
                      </p>
                      {parentPath && (
                        <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                          {parentPath}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-300 mt-0.5 flex-shrink-0">
                      {new Date(article.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {showRecent && recentArticles.length === 0 && (
            <div className="px-5 py-10 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-3">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm text-gray-400">
                Search across all wiki content
              </p>
            </div>
          )}

          {/* Search results */}
          {showResults && (
            <div className="py-2">
              <p className="px-5 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((result, idx) => {
                const isSelected = idx === selectedIdx;

                if (result.kind === "wiki") {
                  const { article, titleMatch, contentMatch } = result;
                  const crumbs = buildBreadcrumb(nodes, article.id);
                  const parentPath = crumbs.slice(0, -1).join(" / ");
                  const snippet = contentMatch
                    ? getSnippet(article.search_text || "", query)
                    : null;
                  return (
                    <button
                      key={`wiki-${article.id}`}
                      data-selected={isSelected}
                      onClick={() => handleSelect(article)}
                      className={`w-full text-left px-5 py-2.5 flex items-start gap-3 transition-colors ${
                        isSelected ? "bg-accent/5" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="mt-0.5">
                        <ResultIcon type={article.node_type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${isSelected ? "text-accent" : "text-gray-800"}`}>
                          {titleMatch ? highlightMatch(article.title, query) : article.title}
                        </p>
                        {parentPath && (
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{parentPath}</p>
                        )}
                        {snippet && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                            {highlightMatch(snippet, query)}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                }

                // Micro-lesson result
                const { lesson, titleMatch, snippet } = result;
                return (
                  <button
                    key={`micro-${lesson.id}`}
                    data-selected={isSelected}
                    onClick={() => handleSelectMicro(lesson)}
                    className={`w-full text-left px-5 py-2.5 flex items-start gap-3 transition-colors ${
                      isSelected ? "bg-accent/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="mt-0.5">
                      <ResultIcon type="micro" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium ${isSelected ? "text-accent" : "text-gray-800"}`}>
                          {titleMatch ? highlightMatch(lesson.title, query) : lesson.title}
                        </p>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#27a28c]/10 text-[#27a28c] flex-shrink-0">
                          Micro-Learning
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                        5 min lesson{lesson.tags && lesson.tags.length > 0 ? ` · ${lesson.tags.slice(0, 3).join(", ")}` : ""}
                      </p>
                      {snippet && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                          {highlightMatch(snippet, query)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {showEmpty && (
            <div className="px-5 py-10 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mx-auto mb-3">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm text-gray-500">
                No results for &ldquo;<span className="font-medium">{query}</span>&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try different keywords or check spelling
              </p>
            </div>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="hidden md:flex items-center gap-4 px-5 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <kbd className="border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] bg-white">↑</kbd>
            <kbd className="border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] bg-white">↓</kbd>
            <span>navigate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <kbd className="border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] bg-white">↵</kbd>
            <span>open</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <kbd className="border border-gray-200 rounded px-1 py-0.5 font-mono text-[10px] bg-white">esc</kbd>
            <span>close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
