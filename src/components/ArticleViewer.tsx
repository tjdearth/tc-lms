"use client";

import { WikiNode } from "@/types";
import { findParentHeading } from "@/lib/mock-data";
import { mockWikiTree } from "@/lib/mock-data";

interface ArticleViewerProps {
  article: WikiNode | null;
  onBrowseClick?: () => void;
}

export default function ArticleViewer({ article, onBrowseClick }: ArticleViewerProps) {
  if (!article) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-4">
        {/* Mobile browse button */}
        {onBrowseClick && (
          <button
            onClick={onBrowseClick}
            className="md:hidden mb-6 px-4 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="18" y2="18" />
            </svg>
            Browse Articles
          </button>
        )}
        <div className="text-center">
          <svg
            className="mx-auto mb-4 text-gray-300"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-sm">Select an article from the sidebar</p>
        </div>
      </div>
    );
  }

  const parentHeading = findParentHeading(mockWikiTree, article.id);
  const authorInitials = "TC";
  const stepCount = article.html_content
    ? (article.html_content.match(/scribe-step-text/g) || []).length
    : 0;
  const readTime = Math.max(1, Math.ceil(stepCount * 0.5));

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Mobile browse button */}
      {onBrowseClick && (
        <div className="md:hidden px-4 pt-4">
          <button
            onClick={onBrowseClick}
            className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="18" y2="18" />
            </svg>
            Browse
          </button>
        </div>
      )}

      <div className="max-w-[900px] mx-auto px-4 py-6 md:px-8 md:py-8">
        {/* Breadcrumb */}
        {parentHeading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 overflow-hidden">
            <span className="hidden md:inline">Salesforce Academy</span>
            <span className="hidden md:inline">/</span>
            <span className="truncate">{parentHeading.title}</span>
            <span>/</span>
            <span className="text-gray-600 truncate">{article.title}</span>
          </div>
        )}

        {/* Category badge */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">
            Salesforce
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-navy mb-3">{article.title}</h1>

        {/* Author info */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-sm font-medium">
            {authorInitials}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              Travel Collection
            </p>
            <p className="text-xs text-gray-400">
              {stepCount > 0 ? `${stepCount} steps` : "Article"} &middot;{" "}
              {readTime} min read
            </p>
          </div>
        </div>

        {/* Description / search text */}
        {article.search_text && !article.html_content && (
          <p className="text-gray-500 leading-relaxed mb-6">
            {article.search_text}
          </p>
        )}

        {/* Article content */}
        {article.html_content ? (
          <div
            className="scribe-content"
            dangerouslySetInnerHTML={{ __html: article.html_content }}
          />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <p className="text-sm">
              Content will be imported from Scribe. This is a placeholder for
              the article.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
