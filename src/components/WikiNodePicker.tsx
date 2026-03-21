"use client";

import { useEffect, useState, useMemo } from "react";
import type { WikiNode } from "@/types";

interface WikiNodePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (nodeId: string, nodeTitle: string) => void;
}

function getAllArticles(nodes: WikiNode[]): WikiNode[] {
  const result: WikiNode[] = [];
  function walk(list: WikiNode[]) {
    for (const node of list) {
      if (node.node_type === "article") result.push(node);
      if (node.children) walk(node.children);
    }
  }
  walk(nodes);
  return result;
}

function TreeItem({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: WikiNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string, title: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;
  const isArticle = node.node_type === "article";
  const isSelected = node.id === selectedId;

  return (
    <div>
      <button
        onClick={() => {
          if (isArticle) {
            onSelect(node.id, node.title);
          } else if (hasChildren) {
            setExpanded(!expanded);
          }
        }}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded-lg transition-colors ${
          isSelected
            ? "bg-[#27a28c]/10 text-[#27a28c] font-medium"
            : "text-[#304256] hover:bg-gray-50"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {hasChildren && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`flex-shrink-0 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
        {!hasChildren && <span className="w-3.5" />}
        {isArticle ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-gray-400"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 text-gray-400"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        )}
        <span className="truncate">{node.title}</span>
      </button>

      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WikiNodePicker({
  isOpen,
  onClose,
  onSelect,
}: WikiNodePickerProps) {
  const [tree, setTree] = useState<WikiNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [pickedTitle, setPickedTitle] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setPickedId(null);
      setPickedTitle("");
      setSearch("");
      setLoading(true);
      fetch("/api/wiki")
        .then((res) => res.json())
        .then((data) => {
          setTree(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  const allArticles = useMemo(() => getAllArticles(tree), [tree]);

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.search_text?.toLowerCase().includes(q)
    );
  }, [search, allArticles]);

  const handlePick = (id: string, title: string) => {
    setPickedId(id);
    setPickedTitle(title);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8ECF1]">
          <h3 className="text-sm font-semibold text-[#304256]">
            Select Wiki Article
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-[#E8ECF1]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full px-3 py-2 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
          />
        </div>

        {/* Tree / Search results */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredArticles ? (
            filteredArticles.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No articles found
              </p>
            ) : (
              <div>
                {filteredArticles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handlePick(article.id, article.title)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                      pickedId === article.id
                        ? "bg-[#27a28c]/10 text-[#27a28c] font-medium"
                        : "text-[#304256] hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="flex-shrink-0 text-gray-400"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className="truncate">{article.title}</span>
                  </button>
                ))}
              </div>
            )
          ) : tree.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No wiki articles available
            </p>
          ) : (
            tree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                depth={0}
                selectedId={pickedId}
                onSelect={handlePick}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#E8ECF1]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:text-[#304256]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (pickedId) {
                onSelect(pickedId, pickedTitle);
                onClose();
              }
            }}
            disabled={!pickedId}
            className="px-4 py-2 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
