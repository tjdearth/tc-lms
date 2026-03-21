import { supabase } from "./supabase";
import { WikiNode, CalendarEvent } from "@/types";

// Build a nested tree from flat Supabase rows
function buildTree(flatNodes: WikiNode[]): WikiNode[] {
  const map = new Map<string, WikiNode>();
  const roots: WikiNode[] = [];

  // First pass: index all nodes
  for (const node of flatNodes) {
    map.set(node.id, { ...node, children: [] });
  }

  // Second pass: attach children to parents
  for (const node of flatNodes) {
    const treeNode = map.get(node.id)!;
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children!.push(treeNode);
    } else {
      roots.push(treeNode);
    }
  }

  // Sort children at each level by sort_order
  const sortChildren = (nodes: WikiNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order);
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children);
      }
    }
  };
  sortChildren(roots);

  return roots;
}

// Fetch wiki tree from Supabase
export async function fetchWikiTree(brand?: string): Promise<WikiNode[]> {
  let query = supabase
    .from("wiki_nodes")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (brand) {
    query = query.eq("brand", brand);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching wiki nodes:", error);
    return [];
  }

  return buildTree(data as WikiNode[]);
}

// Fetch calendar events from Supabase
export async function fetchCalendarEvents(brand?: string): Promise<CalendarEvent[]> {
  let query = supabase
    .from("calendar_events")
    .select("*")
    .order("date_start", { ascending: true });

  if (brand && brand !== "all") {
    query = query.eq("brand", brand);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching calendar events:", error);
    return [];
  }

  return data as CalendarEvent[];
}

// Pure helpers (no mock dependency)

export function getAllArticles(nodes: WikiNode[]): WikiNode[] {
  const articles: WikiNode[] = [];
  for (const node of nodes) {
    // Include articles AND headings that have content
    if (node.node_type === "article" || node.html_content || node.search_text) {
      articles.push(node);
    }
    if (node.children) {
      articles.push(...getAllArticles(node.children));
    }
  }
  return articles;
}

export function findArticleById(nodes: WikiNode[], id: string): WikiNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findArticleById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function findParentHeading(nodes: WikiNode[], articleId: string): WikiNode | null {
  for (const node of nodes) {
    if (node.children) {
      for (const child of node.children) {
        if (child.id === articleId) return node;
        // Also check deeper nesting
        if (child.children) {
          const found = findParentHeading([child], articleId);
          if (found) return found;
        }
      }
    }
  }
  return null;
}

export function buildBreadcrumb(nodes: WikiNode[], targetId: string): string[] {
  const path: string[] = [];
  function walk(items: WikiNode[]): boolean {
    for (const node of items) {
      if (node.id === targetId) {
        path.push(node.title);
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (walk(node.children)) {
          path.unshift(node.title);
          return true;
        }
      }
    }
    return false;
  }
  walk(nodes);
  return path;
}
