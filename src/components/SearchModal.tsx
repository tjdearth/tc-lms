"use client";

import { useState, useEffect, useRef } from "react";
import { WikiNode } from "@/types";
import { getAllArticles, findParentHeading } from "@/lib/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: WikiNode) => void;
  nodes: WikiNode[];
}

export default function SearchModal({
  isOpen,
  onClose,
  onSelectArticle,
  nodes,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const allArticles = getAllArticles(nodes);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? allArticles.filter((a) => {
        const lower = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(lower) ||
          (a.search_text && a.search_text.toLowerCase().includes(lower))
        );
      })
    : [];

  const handleSelect = (article: WikiNode) => {
    onSelectArticle(article);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] md:pt-[15vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[640px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 md:py-4 border-b border-gray-200">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
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
            placeholder="Search wiki articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base outline-none placeholder:text-gray-400 min-w-0"
          />
          <kbd className="hidden md:inline text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              No articles found for &ldquo;{query}&rdquo;
            </div>
          )}
          {results.map((article) => {
            const parent = findParentHeading(nodes, article.id);
            return (
              <button
                key={article.id}
                onClick={() => handleSelect(article)}
                className="w-full text-left px-4 md:px-5 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800">
                  {article.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {parent
                    ? `Salesforce Academy / ${parent.title}`
                    : "Salesforce Academy"}
                </p>
                {article.search_text && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {article.search_text}
                  </p>
                )}
              </button>
            );
          })}
          {!query.trim() && (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              Start typing to search across all wiki articles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
