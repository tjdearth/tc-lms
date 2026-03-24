"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import WikiTree from "@/components/WikiTree";
import ArticleViewer from "@/components/ArticleViewer";
import { fetchWikiTree, findArticleById } from "@/lib/api";
import { WikiNode } from "@/types";
import { useBrand } from "@/lib/brand-context";

function WikiContent() {
  const { brand } = useBrand();
  const isDmc = brand.mode !== "tc";
  const searchParams = useSearchParams();
  const articleParam = searchParams.get("article");
  const [activeArticle, setActiveArticle] = useState<WikiNode | null>(null);
  const [treeOpen, setTreeOpen] = useState(false);
  const [wikiTree, setWikiTree] = useState<WikiNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Resizable panel
  const [panelWidth, setPanelWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setLoading(true);
    const wikiBrand = isDmc ? brand.mode : "tc";
    fetchWikiTree(wikiBrand).then((tree) => {
      setWikiTree(tree);
      setActiveArticle(null);
      setLoading(false);
    });
  }, [brand.mode, isDmc]);

  useEffect(() => {
    if (articleParam && wikiTree.length > 0) {
      const found = findArticleById(wikiTree, articleParam);
      if (found) setActiveArticle(found);
    }
  }, [articleParam, wikiTree]);

  // Panel resize handlers
  useEffect(() => {
    if (!isResizing) return;
    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, 220), 500);
      setPanelWidth(newWidth);
    };
    const onMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  const handleSelectArticle = (article: WikiNode) => {
    setActiveArticle(article);
    setTreeOpen(false);
    window.history.pushState(null, "", `/wiki?article=${article.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Loading wiki...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen" style={{ marginLeft: 0 }}>
      {isDmc && (
        <div className="flex-shrink-0 px-4 py-2 text-xs text-center" style={{ backgroundColor: `${brand.accent}15`, color: brand.accent, borderBottom: `1px solid ${brand.accent}30` }}>
          {brand.name} Wiki
        </div>
      )}
      <div className="flex flex-1 min-h-0">
      <WikiTree
        nodes={wikiTree}
        activeArticleId={activeArticle?.id ?? null}
        onSelectArticle={handleSelectArticle}
        mobileOpen={treeOpen}
        onMobileClose={() => setTreeOpen(false)}
        desktopWidth={panelWidth}
      />
      {/* Resize handle (desktop only) */}
      <div
        onMouseDown={() => setIsResizing(true)}
        className="hidden md:block group relative w-0 flex-shrink-0 cursor-col-resize"
        style={{ zIndex: 10 }}
      >
        <div className="absolute inset-y-0 -left-2 w-4 group-hover:bg-accent/20" />
        <div className="absolute inset-y-0 left-0 w-px bg-gray-200 group-hover:bg-accent/60" />
      </div>
      <ArticleViewer
        article={activeArticle}
        onBrowseClick={() => setTreeOpen(true)}
        allNodes={wikiTree}
      />
      </div>
    </div>
  );
}

export default function WikiPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-gray-400">
            Loading...
          </div>
        }
      >
        <WikiContent />
      </Suspense>
    </AppShell>
  );
}
