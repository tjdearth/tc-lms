"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { supabase } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";
import { WikiNode } from "@/types";

// ── Helpers ──────────────────────────────────────────────

function buildTree(flatNodes: WikiNode[]): WikiNode[] {
  const map = new Map<string, WikiNode>();
  const roots: WikiNode[] = [];
  for (const node of flatNodes) {
    map.set(node.id, { ...node, children: [] });
  }
  for (const node of flatNodes) {
    const treeNode = map.get(node.id)!;
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children!.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }
  const sortChildren = (nodes: WikiNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    for (const n of nodes) {
      if (n.children?.length) sortChildren(n.children);
    }
  };
  sortChildren(roots);
  return roots;
}

function numberingToSortOrder(numbering: string): number {
  // Max Postgres integer: 2,147,483,647
  // Supports up to 5 levels, each 0-99: e.g. 20.99.99.99.99
  const parts = numbering.split(".").map(Number);
  while (parts.length < 5) parts.push(0);
  return (
    parts[0] * 100000000 +
    parts[1] * 1000000 +
    parts[2] * 10000 +
    parts[3] * 100 +
    parts[4]
  );
}

/** Extract numbering prefix and plain name from a title like "3.2.1.5 Creating a Combo" */
function extractNumbering(title: string): { numbering: string; name: string } {
  const match = title.match(/^([\d.]+)(?:\s+(.*))?$/);
  if (match) return { numbering: match[1], name: match[2] || "" };
  return { numbering: "", name: title };
}

function parseScribeHtml(html: string): {
  numbering: string;
  title: string;
  content: string;
} {
  const h1Match = html.match(/<h1[^>]*>([\d.]+)\.?\s+(.*?)<\/h1>/i);
  if (h1Match) {
    // Strip any trailing dots from numbering (e.g. "2." → "2")
    const numbering = h1Match[1].replace(/\.$/, "");
    return {
      numbering,
      title: h1Match[2].trim(),
      content: html,
    };
  }
  const titleOnly = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  return {
    numbering: "",
    title: titleOnly ? titleOnly[1].trim() : "Untitled",
    content: html,
  };
}

// ── API helpers ──────────────────────────────────────────

async function apiCreate(body: Record<string, unknown>) {
  const res = await fetch("/api/wiki", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create");
  }
  return res.json();
}

async function apiUpdate(body: Record<string, unknown>) {
  const res = await fetch("/api/wiki", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update");
  }
  return res.json();
}

async function apiDelete(id: string) {
  const res = await fetch("/api/wiki", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete");
  }
  return res.json();
}

// ── Admin Tree Node ──────────────────────────────────────

function AdminTreeNode({
  node,
  depth,
  selectedId,
  onSelect,
  onAddChild,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  node: WikiNode;
  depth: number;
  selectedId: string | null;
  onSelect: (node: WikiNode) => void;
  onAddChild: (parentId: string) => void;
  onDelete: (node: WikiNode) => void;
  onMoveUp: (node: WikiNode) => void;
  onMoveDown: (node: WikiNode) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const [expanded, setExpanded] = useState(depth < 3);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedId;
  const isHeading = node.node_type === "heading";

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-[6px] text-[13px] rounded-md group cursor-pointer ${
          isSelected ? "bg-accent/10" : "hover:bg-gray-50"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px`, paddingRight: "8px" }}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-5 flex-shrink-0 inline-flex items-center justify-center text-[11px] text-gray-400"
            style={{
              transition: "transform 150ms ease",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            &#x203A;
          </button>
        ) : (
          <span className="w-5 flex-shrink-0" />
        )}

        {/* Title — click to select/edit */}
        <button
          onClick={() => onSelect(node)}
          className={`flex-1 text-left truncate ${
            isSelected
              ? "text-accent font-semibold"
              : isHeading && hasChildren
              ? "text-navy font-semibold"
              : "text-gray-600"
          }`}
        >
          {node.title}
        </button>

        {/* Action buttons (visible on hover) */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Move up */}
          {canMoveUp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(node);
              }}
              className="p-1 text-gray-400 hover:text-accent rounded"
              title="Move up"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          )}
          {/* Move down */}
          {canMoveDown && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(node);
              }}
              className="p-1 text-gray-400 hover:text-accent rounded"
              title="Move down"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
          {/* Add child */}
          {isHeading && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              className="p-1 text-gray-400 hover:text-accent rounded"
              title="Add child"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node);
            }}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
            title="Delete"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div>
          {node.children!.map((child, idx) => (
            <AdminTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              canMoveUp={idx > 0}
              canMoveDown={idx < node.children!.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────

export default function WikiAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [flatNodes, setFlatNodes] = useState<WikiNode[]>([]);
  const [tree, setTree] = useState<WikiNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<WikiNode | null>(null);
  const [mode, setMode] = useState<"import" | "edit">("import");

  // Import state
  const [importRootId, setImportRootId] = useState<string | null>(null);
  const [pastedHtml, setPastedHtml] = useState("");
  const [parsedTitle, setParsedTitle] = useState("");
  const [parsedNumbering, setParsedNumbering] = useState("");
  const [importCount, setImportCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Edit state
  const [editTitle, setEditTitle] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Add child state
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [addTitle, setAddTitle] = useState("");
  const [addType, setAddType] = useState<"heading" | "article">("heading");

  const fetchNodes = useCallback(async () => {
    const { data } = await supabase
      .from("wiki_nodes")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) {
      setFlatNodes(data as WikiNode[]);
      setTree(buildTree(data as WikiNode[]));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  // Parse pasted HTML
  useEffect(() => {
    if (!pastedHtml.trim()) {
      setParsedTitle("");
      setParsedNumbering("");
      return;
    }
    const parsed = parseScribeHtml(pastedHtml);
    setParsedTitle(parsed.title);
    setParsedNumbering(parsed.numbering);
  }, [pastedHtml]);

  // When selecting a node for editing
  const handleSelectNode = (node: WikiNode) => {
    setSelectedNode(node);
    setMode("edit");
    setEditTitle(node.title);
    setEditHtml(node.html_content || "");
    setAddParentId(null);
  };

  // ── Move up/down ──────────────────────────────────────
  const handleMove = async (node: WikiNode, direction: "up" | "down") => {
    // Get siblings sorted by sort_order
    const siblings = flatNodes
      .filter((n) => n.parent_id === node.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order);

    const idx = siblings.findIndex((s) => s.id === node.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= siblings.length) return;

    const current = siblings[idx];
    const swap = siblings[swapIdx];

    // Swap sort_orders
    const currentSortOrder = current.sort_order;
    const swapSortOrder = swap.sort_order;

    // Swap numbering in titles
    const currentParts = extractNumbering(current.title);
    const swapParts = extractNumbering(swap.title);

    const newCurrentTitle =
      swapParts.numbering
        ? `${swapParts.numbering} ${currentParts.name}`
        : currentParts.name;
    const newSwapTitle =
      currentParts.numbering
        ? `${currentParts.numbering} ${swapParts.name}`
        : swapParts.name;

    try {
      await Promise.all([
        apiUpdate({
          id: current.id,
          sort_order: swapSortOrder,
          title: newCurrentTitle,
        }),
        apiUpdate({
          id: swap.id,
          sort_order: currentSortOrder,
          title: newSwapTitle,
        }),
      ]);
      setStatusMsg(
        `✓ Moved "${currentParts.name}" ${direction}`
      );
      await fetchNodes();
      // Keep the moved node selected if it was
      if (selectedNode?.id === current.id) {
        setSelectedNode({ ...current, sort_order: swapSortOrder, title: newCurrentTitle });
        setEditTitle(newCurrentTitle);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setStatusMsg(`✗ Error: ${message}`);
    }
  };

  // Find or create parent headings for a numbering like "3.2.1.1"
  async function ensureParentHeadings(
    numbering: string,
    brand: string,
    rootParentId: string | null
  ): Promise<string | null> {
    const parts = numbering.split(".");
    if (parts.length <= 1) return rootParentId;

    const ancestorNumberings: string[] = [];
    for (let i = 1; i < parts.length; i++) {
      ancestorNumberings.push(parts.slice(0, i).join("."));
    }

    const { data: currentNodes } = await supabase
      .from("wiki_nodes")
      .select("id, title, sort_order")
      .order("sort_order");

    // Map numbering prefix → node id (e.g. "2.4" from title "2.4 Dashboards and Reports")
    const nodesByNumbering = new Map<string, string>();
    if (currentNodes) {
      for (const n of currentNodes) {
        const { numbering } = extractNumbering(n.title);
        if (numbering) nodesByNumbering.set(numbering, n.id);
      }
    }

    // First ancestor's parent is the import root (e.g. "Salesforce Academy")
    let parentId: string | null = rootParentId;

    for (const ancestorNum of ancestorNumberings) {
      const existingId = nodesByNumbering.get(ancestorNum);

      if (existingId) {
        parentId = existingId;
      } else {
        const sortOrder = numberingToSortOrder(ancestorNum);
        const created = await apiCreate({
          title: ancestorNum,
          node_type: "heading",
          parent_id: parentId,
          sort_order: sortOrder,
          brand,
        });
        parentId = created.id;
        nodesByNumbering.set(ancestorNum, created.id);
      }
    }

    return parentId;
  }

  // Save imported Scribe article — with conflict handling (shift siblings down)
  const handleImportSave = async () => {
    if (!pastedHtml.trim()) return;
    setSaving(true);
    setStatusMsg("");

    try {
      const parsed = parseScribeHtml(pastedHtml);
      let parentId: string | null = null;
      let sortOrder = 0;

      if (parsed.numbering) {
        parentId = await ensureParentHeadings(parsed.numbering, "tc", importRootId);
        sortOrder = numberingToSortOrder(parsed.numbering);
      }

      const fullTitle = parsed.numbering
        ? `${parsed.numbering} ${parsed.title}`
        : parsed.title;

      // Check if a bare heading exists with this exact numbering (e.g. "2" placeholder)
      // If so, update it with the full title and content instead of creating a duplicate
      const bareHeading = parsed.numbering
        ? flatNodes.find((n) => {
            const { numbering } = extractNumbering(n.title);
            return numbering === parsed.numbering && n.node_type === "heading" && !extractNumbering(n.title).name;
          })
        : null;

      if (bareHeading) {
        await apiUpdate({
          id: bareHeading.id,
          title: fullTitle,
          html_content: parsed.content,
        });
        setStatusMsg(`✓ "${parsed.title}" updated (existing heading)`);
        setImportCount((c) => c + 1);
        setPastedHtml("");
        await fetchNodes();
        setSaving(false);
        return;
      }

      // Check if an article already exists with this numbering — if so, update it (re-import)
      const existing = parsed.numbering
        ? flatNodes.find((n) => {
            const { numbering } = extractNumbering(n.title);
            return numbering === parsed.numbering;
          })
        : null;

      if (existing) {
        // Update existing article with new content
        await apiUpdate({
          id: existing.id,
          title: fullTitle,
          html_content: parsed.content,
        });
        setStatusMsg(`✓ "${parsed.title}" updated (existing article)`);
      } else {
        // Create new article
        await apiCreate({
          title: fullTitle,
          node_type: "article",
          parent_id: parentId,
          sort_order: sortOrder,
          brand: "tc",
          html_content: parsed.content,
        });
        setStatusMsg(`✓ "${parsed.title}" saved successfully`);
      }

      setImportCount((c) => c + 1);
      setPastedHtml("");
      setParsedTitle("");
      setParsedNumbering("");
      await fetchNodes();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setStatusMsg(`✗ Error: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  // Save edited node
  const handleEditSave = async () => {
    if (!selectedNode) return;
    setEditSaving(true);
    try {
      const updates: Record<string, unknown> = { id: selectedNode.id, title: editTitle };
      if (selectedNode.node_type === "article") {
        updates.html_content = editHtml;
      }
      await apiUpdate(updates);
      setStatusMsg(`✓ "${editTitle}" updated`);
      await fetchNodes();
      setSelectedNode({ ...selectedNode, title: editTitle, html_content: editHtml });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setStatusMsg(`✗ Error: ${message}`);
    } finally {
      setEditSaving(false);
    }
  };

  // Delete node
  const handleDelete = async (node: WikiNode) => {
    if (!confirm(`Delete "${node.title}"? This cannot be undone.`)) return;
    try {
      await apiDelete(node.id);
      setStatusMsg(`✓ "${node.title}" deleted`);
      if (selectedNode?.id === node.id) {
        setSelectedNode(null);
        setMode("import");
      }
      await fetchNodes();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setStatusMsg(`✗ Error: ${message}`);
    }
  };

  // Add child node
  const handleAddChild = async () => {
    if (!addParentId || !addTitle.trim()) return;
    try {
      const siblings = flatNodes.filter((n) => n.parent_id === addParentId);
      const maxSort = siblings.length > 0
        ? Math.max(...siblings.map((s) => s.sort_order))
        : 0;

      await apiCreate({
        title: addTitle,
        node_type: addType,
        parent_id: addParentId,
        sort_order: maxSort + 1,
        brand: "tc",
      });
      setStatusMsg(`✓ "${addTitle}" created`);
      setAddTitle("");
      setAddParentId(null);
      await fetchNodes();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setStatusMsg(`✗ Error: ${message}`);
    }
  };

  // Compute parent chain for preview
  const getParentChain = (numbering: string): string[] => {
    if (!numbering) return [];
    const parts = numbering.split(".");
    const chain: string[] = [];
    for (let i = 1; i <= parts.length; i++) {
      chain.push(parts.slice(0, i).join("."));
    }
    return chain;
  };

  // Auth guard — block non-admins
  if (status === "loading") {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
        </div>
      </AppShell>
    );
  }
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }
  if (!isAdmin(session?.user?.email)) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-lg font-semibold text-navy mb-2">Access Denied</h1>
            <p className="text-sm text-gray-500">You don&apos;t have admin access.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Get root-level siblings for canMoveUp/Down on root nodes
  const rootNodes = tree;

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-3.5rem)] md:h-screen" style={{ marginLeft: 0 }}>
        {/* ── Left: Tree Panel ── */}
        <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="px-4 pt-5 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-navy">Wiki Tree</h2>
              <span className="text-[11px] text-gray-400">{flatNodes.length} nodes</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-1">
            {loading ? (
              <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
            ) : tree.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No nodes yet</div>
            ) : (
              tree.map((node, idx) => (
                <AdminTreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedNode?.id ?? null}
                  onSelect={handleSelectNode}
                  onAddChild={(parentId) => {
                    setAddParentId(parentId);
                    setAddTitle("");
                    setAddType("heading");
                    setMode("import");
                    setSelectedNode(null);
                  }}
                  onDelete={handleDelete}
                  onMoveUp={(n) => handleMove(n, "up")}
                  onMoveDown={(n) => handleMove(n, "down")}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < rootNodes.length - 1}
                />
              ))
            )}
          </div>

          {/* Add root heading button */}
          <div className="px-3 py-3 border-t border-gray-200">
            <button
              onClick={() => {
                setAddParentId("__root__");
                setAddTitle("");
                setAddType("heading");
                setMode("import");
                setSelectedNode(null);
              }}
              className="w-full px-3 py-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-accent hover:text-accent transition-colors"
            >
              + Add Root Heading
            </button>
          </div>
        </div>

        {/* ── Right: Import / Edit Panel ── */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-[800px] mx-auto p-6 md:p-8">
            {/* Status message */}
            {statusMsg && (
              <div
                className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
                  statusMsg.startsWith("✓")
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {statusMsg}
              </div>
            )}

            {/* Add child form */}
            {addParentId && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h3 className="text-sm font-semibold text-navy mb-3">
                  Add {addParentId === "__root__" ? "Root" : "Child"} Node
                </h3>
                <div className="flex gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Node title..."
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                    autoFocus
                  />
                  <select
                    value={addType}
                    onChange={(e) => setAddType(e.target.value as "heading" | "article")}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="heading">Heading</option>
                    <option value="article">Article</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!addTitle.trim()) return;
                      if (addParentId === "__root__") {
                        const maxSort = flatNodes
                          .filter((n) => !n.parent_id)
                          .reduce((max, n) => Math.max(max, n.sort_order), 0);
                        await apiCreate({
                          title: addTitle,
                          node_type: addType,
                          parent_id: null,
                          sort_order: maxSort + 1,
                          brand: "tc",
                        });
                        setStatusMsg(`✓ "${addTitle}" created`);
                        setAddParentId(null);
                        setAddTitle("");
                        await fetchNodes();
                      } else {
                        await handleAddChild();
                      }
                    }}
                    className="px-4 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setAddParentId(null)}
                    className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tab bar */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-0.5 w-fit">
              <button
                onClick={() => {
                  setMode("import");
                  setSelectedNode(null);
                }}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  mode === "import"
                    ? "bg-white text-navy font-medium shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Scribe Import
                {importCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-accent text-white rounded-full">
                    {importCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMode("edit")}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  mode === "edit"
                    ? "bg-white text-navy font-medium shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Edit Node
              </button>
            </div>

            {/* ── Import Mode ── */}
            {mode === "import" && (
              <div>
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
                  <label className="block text-sm font-semibold text-navy mb-1">
                    Import into
                  </label>
                  <select
                    value={importRootId || ""}
                    onChange={(e) => setImportRootId(e.target.value || null)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-accent mb-4"
                  >
                    <option value="">Top level (no parent)</option>
                    {flatNodes
                      .filter((n) => n.node_type === "heading")
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.title}
                        </option>
                      ))}
                  </select>

                  <h3 className="text-sm font-semibold text-navy mb-1">
                    Paste Scribe HTML
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Copy the HTML code snippet from Scribe and paste it below. The title and numbering will be auto-detected.
                  </p>
                  <textarea
                    value={pastedHtml}
                    onChange={(e) => setPastedHtml(e.target.value)}
                    placeholder='<h1 class="scribe-title">3.2.1.1 Creating a New Trip</h1>&#10;<div class="scribe-step">...'
                    className="w-full h-48 px-4 py-3 text-sm font-mono border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-accent resize-y"
                  />
                </div>

                {/* Parsed preview */}
                {pastedHtml.trim() && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
                    <h3 className="text-sm font-semibold text-navy mb-3">
                      Detected
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-20">Numbering</span>
                        {parsedNumbering ? (
                          <span className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent rounded">
                            {parsedNumbering}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            None detected — will need manual placement
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-20">Title</span>
                        <span className="text-sm font-medium text-gray-800">
                          {parsedTitle || "—"}
                        </span>
                      </div>
                      {parsedNumbering && (
                        <div className="flex items-start gap-3">
                          <span className="text-xs text-gray-400 w-20">Tree path</span>
                          <div className="flex flex-wrap gap-1">
                            {getParentChain(parsedNumbering).map((seg, i, arr) => (
                              <span key={seg} className="flex items-center gap-1">
                                <span
                                  className={`px-1.5 py-0.5 text-[11px] rounded ${
                                    i === arr.length - 1
                                      ? "bg-accent/10 text-accent font-medium"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  {seg}
                                </span>
                                {i < arr.length - 1 && (
                                  <span className="text-gray-300">›</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* HTML preview */}
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400 mb-2">Content preview</p>
                      <div
                        className="scribe-content max-h-[300px] overflow-y-auto rounded-lg border border-gray-100 p-4"
                        dangerouslySetInnerHTML={{ __html: pastedHtml }}
                      />
                    </div>
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={handleImportSave}
                  disabled={saving || !pastedHtml.trim()}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    saving || !pastedHtml.trim()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-accent text-white hover:bg-accent/90"
                  }`}
                >
                  {saving ? "Saving..." : "Save & Next"}
                </button>

                {importCount > 0 && (
                  <span className="ml-3 text-sm text-gray-400">
                    {importCount} article{importCount !== 1 ? "s" : ""} imported this session
                  </span>
                )}
              </div>
            )}

            {/* ── Edit Mode ── */}
            {mode === "edit" && (
              <div>
                {!selectedNode ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
                    <p className="text-sm">
                      Select a node from the tree to edit it
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Title */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                            selectedNode.node_type === "heading"
                              ? "bg-navy/10 text-navy"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {selectedNode.node_type}
                        </span>
                        <span className="text-xs text-gray-400">
                          ID: {selectedNode.id.slice(0, 8)}...
                        </span>
                      </div>
                      <label className="text-xs text-gray-400 block mb-1">Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-accent"
                      />
                    </div>

                    {/* HTML content (articles only) */}
                    {selectedNode.node_type === "article" && (
                      <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <label className="text-xs text-gray-400 block mb-1">
                          HTML Content
                        </label>
                        <textarea
                          value={editHtml}
                          onChange={(e) => setEditHtml(e.target.value)}
                          className="w-full h-64 px-4 py-3 text-sm font-mono border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-accent resize-y"
                        />
                        {/* Preview */}
                        {editHtml && (
                          <div className="mt-4 border-t border-gray-100 pt-4">
                            <p className="text-xs text-gray-400 mb-2">Preview</p>
                            <div
                              className="scribe-content max-h-[300px] overflow-y-auto rounded-lg border border-gray-100 p-4"
                              dangerouslySetInnerHTML={{ __html: editHtml }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Save / Delete */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleEditSave}
                        disabled={editSaving}
                        className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          editSaving
                            ? "bg-gray-200 text-gray-400"
                            : "bg-accent text-white hover:bg-accent/90"
                        }`}
                      >
                        {editSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => handleDelete(selectedNode)}
                        className="px-4 py-2.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete Node
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
