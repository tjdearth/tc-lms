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
  const [expanded, setExpanded] = useState(depth < 3);
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
        className="w-full text-left flex items-center gap-1 py-[7px] text-[13px] transition-colors rounded-md"
        style={{
          paddingLeft: `${depth * 14 + 12}px`,
          paddingRight: "12px",
          backgroundColor: isActive ? "rgba(39,162,140,0.13)" : "transparent",
          color: isActive ? "#1a6b5c" : isHeading ? "#1a2a3a" : "#4a5568",
          fontWeight: isActive ? 600 : isHeading ? 600 : 400,
          borderLeft: isActive ? "3px solid #27a28c" : "3px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "#f7f8f9";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {hasChildren ? (
          <span
            className="w-5 flex-shrink-0 inline-flex items-center justify-center text-[11px]"
            style={{ color: isActive ? "#27a28c" : "#9ca3af", transition: "transform 150ms ease", transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            &#x203A;
          </span>
        ) : (
          <span className="w-5 flex-shrink-0" />
        )}
        <span className={isActive ? "" : ""}>{node.title}</span>
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
    <div className="flex flex-col h-full">
      {/* Header: Wikis title + close button */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#304256" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h1 className="text-lg font-bold" style={{ color: "#1a2a3a" }}>Wikis</h1>
        </div>
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
      <div className="px-4 pb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#9ca3af" }}
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
            placeholder="Search in Wikis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg focus:outline-none placeholder:text-gray-400"
            style={{
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8f9fb",
            }}
          />
        </div>
      </div>

      {/* ALL WIKIS section */}
      <div className="px-4 pb-1">
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#8a9bb0" }}>
          All Wikis
        </span>
      </div>
      <div className="px-3 pb-2">
        {["Across Mexico", "All Users", "Salesforce Academy"].map((name) => (
          <button
            key={name}
            className="w-full text-left flex items-center gap-1 py-[7px] px-3 text-[13px] rounded-md transition-colors"
            style={{ color: "#4a5568" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f7f8f9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <span className="w-5 flex-shrink-0 inline-flex items-center justify-center text-[11px]" style={{ color: "#9ca3af" }}>
              &#x203A;
            </span>
            {name}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3" style={{ borderBottom: "1px solid #e2e8f0" }} />

      {/* SALESFORCE ACADEMY section label */}
      <div className="px-4 pb-2">
        <span className="text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "#8a9bb0" }}>
          Salesforce Academy
        </span>
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
    </div>
  );

  return (
    <>
      {/* Desktop: standard sidebar panel */}
      <div className="hidden md:flex w-[300px] bg-white border-r border-gray-200 flex-col h-full flex-shrink-0">
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
