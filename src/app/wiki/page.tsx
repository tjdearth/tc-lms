"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import WikiTree from "@/components/WikiTree";
import ArticleViewer from "@/components/ArticleViewer";
import { mockWikiTree, findArticleById } from "@/lib/mock-data";
import { WikiNode } from "@/types";

function WikiContent() {
  const searchParams = useSearchParams();
  const articleParam = searchParams.get("article");
  const [activeArticle, setActiveArticle] = useState<WikiNode | null>(null);
  const [treeOpen, setTreeOpen] = useState(false);

  useEffect(() => {
    if (articleParam) {
      const found = findArticleById(mockWikiTree, articleParam);
      if (found) setActiveArticle(found);
    }
  }, [articleParam]);

  const handleSelectArticle = (article: WikiNode) => {
    setActiveArticle(article);
    setTreeOpen(false);
    window.history.pushState(null, "", `/wiki?article=${article.id}`);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] md:h-screen" style={{ marginLeft: 0 }}>
      <WikiTree
        nodes={mockWikiTree}
        activeArticleId={activeArticle?.id ?? null}
        onSelectArticle={handleSelectArticle}
        mobileOpen={treeOpen}
        onMobileClose={() => setTreeOpen(false)}
      />
      <ArticleViewer
        article={activeArticle}
        onBrowseClick={() => setTreeOpen(true)}
      />
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
