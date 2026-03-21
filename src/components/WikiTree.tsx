"use client";

import { useState } from "react";
import { WikiNode } from "@/types";

interface WikiTreeProps {
  nodes: WikiNode[];
  activeArticleId: string | null;
  onSelectArticle: (article: WikiNode) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function TreeNode({
  node,
  depth,
  activeArticleId,
  onSelectArticle,
}: {
  node: WikiNode;
  depth: number;
  activeArticleId: string | null;
  onSelectArticle: (article: WikiNode) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isHeading = node.node_type === "heading";
  const isActive = node.id === activeArticleId;

  return (
    <div>
      <button
        onClick={() => {
          if (isHeading && hasChildren) {
            setExpanded(!expanded);
          } else if (node.node_type === "article") {
            onSelectArticle(node);
          }
        }}
        className={`w-full text-left flex items-center gap-1.5 py-2 px-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-accent text-white font-medium shadow-sm"
            : isHeading
            ? "text-navy font-semibold hover:bg-gray-100"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren && (
          <span className="text-gray-400 text-xs w-4 flex-shrink-0 inline-flex items-center justify-center">
            {expanded ? "\u25BE" : "\u25B8"}
          </span>
        )}
        {!hasChildren && !isHeading && (
          <span className="w-4 flex-shrink-0" />
        )}
        <span className="truncate">{node.title}</span>
      </button>
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              activeArticleId={activeArticleId}
              onSelectArticle={onSelectArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WikiTree({
  nodes,
  activeArticleId,
  onSelectArticle,
  mobileOpen,
  onMobileClose,
}: WikiTreeProps) {
  const [search, setSearch] = useState("");

  const filterNodes = (items: WikiNode[], query: string): WikiNode[] => {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items
      .map((node) => {
        const matchesTitle = node.title.toLowerCase().includes(lower);
        const filteredChildren = node.children
          ? filterNodes(node.children, query)
          : [];
        if (matchesTitle || filteredChildren.length > 0) {
          return {
            ...node,
            children:
              filteredChildren.length > 0 ? filteredChildren : node.children,
          };
        }
        return null;
      })
      .filter(Boolean) as WikiNode[];
  };

  const filteredNodes = filterNodes(nodes, search);

  const handleSelect = (article: WikiNode) => {
    onSelectArticle(article);
    if (onMobileClose) onMobileClose();
  };

  const treeContent = (
    <>
      {/* Section label */}
      <div className="px-4 pt-5 pb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold text-navy tracking-widest uppercase">
          Salesforce Academy
        </h2>
        {/* Mobile close button */}
        <button
          onClick={onMobileClose}
          className="md:hidden text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close browse"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search wiki..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 wiki-tree-scroll">
        {filteredNodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            activeArticleId={activeArticleId}
            onSelectArticle={handleSelect}
          />
        ))}
        {filteredNodes.length === 0 && search && (
          <p className="text-sm text-gray-400 px-3 py-4">No results found.</p>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: standard sidebar panel */}
      <div className="hidden md:flex w-[280px] bg-white border-r border-gray-200 flex-col h-full flex-shrink-0">
        {treeContent}
      </div>

      {/* Mobile: full-screen overlay drawer from left */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[80]"
          onClick={onMobileClose}
        />
      )}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white z-[81] flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {treeContent}
      </div>
    </>
  );
}
