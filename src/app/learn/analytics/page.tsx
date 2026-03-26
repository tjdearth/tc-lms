"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import { isCourseCreator, isAdmin } from "@/lib/admin";
import { getBrandColor } from "@/lib/brands";

interface KBHealth {
  wiki_articles: number;
  course_lessons: number;
  lessons_with_content: number;
  lessons_with_transcripts: number;
  micro_lessons: number;
  micro_with_transcripts: number;
  quiz_questions: number;
  estimated_context_chars: number;
  context_limit: number;
  usage_pct: number;
}

interface AnalyticsData {
  overview: {
    total_users: number;
    total_enrollments: number;
    completed: number;
    completion_rate: number;
    avg_quiz_score: number | null;
  };
  courses: {
    id: string;
    title: string;
    code: string;
    enrolled: number;
    completed: number;
    completion_pct: number;
  }[];
  overdue: {
    user_name: string;
    user_email: string;
    user_brand: string;
    course_title: string;
    due_date: string;
  }[];
  brand_breakdown: {
    brand: string;
    enrolled: number;
    completed: number;
  }[];
  kb_health?: KBHealth;
}

interface SearchAnalyticsData {
  top_searches: { query: string; count: number; source: string }[];
  no_results_queries: { query: string; count: number }[];
  volume: { this_week: number; this_month: number };
  feedback: {
    total_positive: number;
    total_negative: number;
    helpfulness_rate: number | null;
    negative_queries: { query: string; count: number }[];
  };
}

function SourceBadge({ source }: { source: string }) {
  if (source === "ai_chat") {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#27a28c]/10 text-[#27a28c]">
        AI
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">
      Wiki
    </span>
  );
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<SearchAnalyticsData | null>(null);

  const hasAccess = status === "authenticated" && isCourseCreator(session?.user?.email || "");
  const showSearchAnalytics = status === "authenticated" && isAdmin(session?.user?.email || "");

  useEffect(() => {
    if (!hasAccess) return;
    fetch("/api/learn/analytics")
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hasAccess]);

  useEffect(() => {
    if (!showSearchAnalytics) return;
    fetch("/api/search-log")
      .then((r) => r.ok ? r.json() : null)
      .then(setSearchData)
      .catch(() => {});
  }, [showSearchAnalytics]);

  if (status === "loading") return <AppShell><div className="p-8"><div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin mx-auto mt-20" /></div></AppShell>;

  if (!hasAccess) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#eeeeee" }}>
          <div className="bg-white rounded-xl border border-[#E8ECF1] p-8 text-center max-w-md">
            <h2 className="text-lg font-semibold text-[#304256] mb-2">Access Denied</h2>
            <p className="text-sm text-gray-500">You don&apos;t have permission to access analytics.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#304256] mb-1">Analytics</h1>
          <p className="text-gray-500">Learning platform performance and engagement metrics</p>
        </div>

        {loading || !data ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Users", value: data.overview.total_users },
                { label: "Total Enrollments", value: data.overview.total_enrollments },
                { label: "Completion Rate", value: `${data.overview.completion_rate}%` },
                { label: "Avg Quiz Score", value: data.overview.avg_quiz_score !== null ? `${data.overview.avg_quiz_score}%` : "\u2014" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                  <div className="text-2xl font-bold text-[#304256]">{s.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Course Performance */}
            <div className="bg-white rounded-xl border border-[#E8ECF1] mb-8 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8ECF1]">
                <h2 className="font-semibold text-[#304256]">Course Performance</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Course</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Code</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500">Enrolled</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500">Completed</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500">Completion %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.courses.filter((c) => c.enrolled > 0).sort((a, b) => b.enrolled - a.enrolled).map((c) => (
                      <tr key={c.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-medium text-gray-800">{c.title}</td>
                        <td className="px-5 py-3 text-gray-400 font-mono text-xs">{c.code}</td>
                        <td className="px-5 py-3 text-right text-gray-600 tabular-nums">{c.enrolled}</td>
                        <td className="px-5 py-3 text-right text-gray-600 tabular-nums">{c.completed}</td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          <span className={`font-semibold ${c.completion_pct >= 70 ? "text-emerald-600" : c.completion_pct >= 40 ? "text-amber-600" : "text-red-500"}`}>
                            {c.completion_pct}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {data.courses.filter((c) => c.enrolled > 0).length === 0 && (
                      <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No enrollment data yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Overdue Learners */}
              <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8ECF1] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <h2 className="font-semibold text-[#304256]">Overdue Learners</h2>
                  {data.overdue.length > 0 && (
                    <span className="text-[10px] bg-red-50 text-red-600 rounded-full px-2 py-0.5 font-medium">{data.overdue.length}</span>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {data.overdue.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <div className="text-2xl mb-2">&#10003;</div>
                      <p className="text-sm text-gray-400">No overdue learners — great job!</p>
                    </div>
                  ) : (
                    <div>
                      {data.overdue.map((o, i) => {
                        const daysOverdue = Math.ceil((new Date().getTime() - new Date(o.due_date).getTime()) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={i} className="px-5 py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-800">{o.user_name}</p>
                                <p className="text-xs text-gray-400">{o.user_brand}</p>
                              </div>
                              <span className="text-xs font-semibold text-red-500">{daysOverdue}d overdue</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{o.course_title}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Breakdown */}
              <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8ECF1]">
                  <h2 className="font-semibold text-[#304256]">Brand Breakdown</h2>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {data.brand_breakdown.length === 0 ? (
                    <div className="px-5 py-8 text-center text-gray-400 text-sm">No data yet</div>
                  ) : (
                    <div>
                      {data.brand_breakdown.map((b) => (
                        <div key={b.brand} className="px-5 py-3 border-b border-gray-100 last:border-b-0 flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getBrandColor(b.brand) }} />
                          <span className="flex-1 text-sm font-medium text-gray-800 truncate">{b.brand}</span>
                          <div className="flex items-center gap-4 text-xs tabular-nums">
                            <div className="text-right">
                              <span className="text-gray-600 font-medium">{b.enrolled}</span>
                              <span className="text-gray-400 ml-1">enrolled</span>
                            </div>
                            <div className="text-right">
                              <span className="text-emerald-600 font-medium">{b.completed}</span>
                              <span className="text-gray-400 ml-1">done</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* KB Health (admin only) */}
            {showSearchAnalytics && data.kb_health && (() => {
              const kb = data.kb_health;
              const pct = kb.usage_pct;
              const status = pct < 50 ? "healthy" : pct < 75 ? "growing" : pct < 95 ? "attention" : "critical";
              const statusConfig = {
                healthy: { color: "#27a28c", bg: "bg-emerald-50", text: "text-emerald-700", label: "Healthy", barColor: "#27a28c" },
                growing: { color: "#E8A838", bg: "bg-amber-50", text: "text-amber-700", label: "Growing", barColor: "#E8A838" },
                attention: { color: "#F97316", bg: "bg-orange-50", text: "text-orange-700", label: "Needs Attention", barColor: "#F97316" },
                critical: { color: "#DC2626", bg: "bg-red-50", text: "text-red-700", label: "Upgrade Needed", barColor: "#DC2626" },
              }[status];
              const totalContent = kb.wiki_articles + kb.course_lessons + kb.micro_lessons;

              return (
                <div className="mb-8">
                  <div className="mb-4 mt-2">
                    <h2 className="text-lg font-bold text-[#304256]">Atlas AI — Knowledge Base Health</h2>
                    <p className="text-sm text-gray-400">Tracks KB size vs. context window. When it fills up, Atlas AI starts losing access to content.</p>
                  </div>

                  {/* Status banner */}
                  <div className={`rounded-xl border p-5 mb-6 ${statusConfig.bg}`} style={{ borderColor: statusConfig.color + "30" }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusConfig.color }} />
                        <span className={`text-sm font-semibold ${statusConfig.text}`}>{statusConfig.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: statusConfig.color }}>
                        {pct}% used
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-3 rounded-full bg-white/60 overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: statusConfig.barColor }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{(kb.estimated_context_chars / 1000).toFixed(0)}K chars used</span>
                      <span>{(kb.context_limit / 1000).toFixed(0)}K char context limit</span>
                    </div>

                    {pct >= 75 && (
                      <p className={`text-xs mt-3 ${statusConfig.text}`}>
                        {pct >= 95
                          ? "⚠️ Context is full — Atlas AI is losing access to content. Time to implement vector search (RAG)."
                          : "📈 Getting close to the context limit. Consider planning a migration to vector search soon."}
                      </p>
                    )}
                  </div>

                  {/* Content breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Wiki Articles", value: kb.wiki_articles, icon: "📄" },
                      { label: "Course Lessons", value: kb.course_lessons, sub: `${kb.lessons_with_transcripts} with transcripts` },
                      { label: "Micro-Lessons", value: kb.micro_lessons, sub: `${kb.micro_with_transcripts} with transcripts` },
                      { label: "Quiz Questions", value: kb.quiz_questions, icon: "❓" },
                    ].map((item) => (
                      <div key={item.label} className="bg-white rounded-xl border border-[#E8ECF1] p-4">
                        <div className="text-xl font-bold text-[#304256]">{item.value}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
                        {item.sub && <div className="text-[10px] text-gray-300 mt-1">{item.sub}</div>}
                      </div>
                    ))}
                  </div>

                  {/* Threshold guide */}
                  <div className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                    <h3 className="text-xs font-semibold text-[#304256] uppercase tracking-wider mb-3">Context Budget Guide</h3>
                    <div className="space-y-2">
                      {[
                        { range: "0–50%", color: "#27a28c", label: "Healthy", desc: "Current approach works fine. All content fits in context." },
                        { range: "50–75%", color: "#E8A838", label: "Growing", desc: "Still working but getting crowded. Start thinking about next steps." },
                        { range: "75–95%", color: "#F97316", label: "Plan Upgrade", desc: "Content is being truncated. Begin implementing vector search (RAG)." },
                        { range: "95%+", color: "#DC2626", label: "Upgrade Needed", desc: "Atlas AI can't see all content. Vector search is now essential." },
                      ].map((t) => (
                        <div key={t.range} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: t.color }} />
                          <div>
                            <span className="text-xs font-semibold text-gray-700">{t.range} — {t.label}</span>
                            <p className="text-xs text-gray-400">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-300 mt-4">
                      Total content items: {totalContent} | Estimated at ~{(kb.estimated_context_chars / totalContent || 0).toFixed(0)} chars avg per item
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Search Analytics (admin only) */}
            {showSearchAnalytics && searchData && (
              <>
                <div className="mb-4 mt-2">
                  <h2 className="text-lg font-bold text-[#304256]">Search Analytics</h2>
                  <p className="text-sm text-gray-400">What users are searching for across the platform</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                    <div className="text-2xl font-bold text-[#304256]">{searchData.volume.this_week}</div>
                    <div className="text-sm text-gray-400 mt-1">Searches This Week</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                    <div className="text-2xl font-bold text-[#304256]">{searchData.volume.this_month}</div>
                    <div className="text-sm text-gray-400 mt-1">Searches This Month</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Top Searched Terms */}
                  <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#E8ECF1] flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" className="flex-shrink-0">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <h2 className="font-semibold text-[#304256]">Top 20 Searched Terms</h2>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchData.top_searches.length === 0 ? (
                        <div className="px-5 py-8 text-center text-gray-400 text-sm">No search data yet</div>
                      ) : (
                        <div>
                          {searchData.top_searches.map((s, i) => (
                            <div key={s.query} className="px-5 py-2.5 border-b border-gray-100 last:border-b-0 flex items-center gap-3">
                              <span className="text-xs text-gray-300 w-5 text-right tabular-nums">{i + 1}</span>
                              <span className="flex-1 text-sm text-gray-800 truncate">{s.query}</span>
                              <SourceBadge source={s.source} />
                              <span className="text-xs font-semibold text-[#27a28c] tabular-nums">{s.count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* No Results Queries */}
                  <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#E8ECF1] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <h2 className="font-semibold text-[#304256]">No Results Searches</h2>
                      {searchData.no_results_queries.length > 0 && (
                        <span className="text-[10px] bg-amber-50 text-amber-600 rounded-full px-2 py-0.5 font-medium">
                          {searchData.no_results_queries.length}
                        </span>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchData.no_results_queries.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                          <div className="text-2xl mb-2">&#10003;</div>
                          <p className="text-sm text-gray-400">All searches returned results</p>
                        </div>
                      ) : (
                        <div>
                          {searchData.no_results_queries.map((s) => (
                            <div key={s.query} className="px-5 py-2.5 border-b border-gray-100 last:border-b-0 flex items-center justify-between">
                              <span className="text-sm text-gray-800 truncate">{s.query}</span>
                              <span className="text-xs font-semibold text-amber-600 tabular-nums">{s.count}x</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-[#304256]">AI Feedback</h2>
                  <p className="text-sm text-gray-400">How helpful users find AI responses</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                    <div className="text-2xl font-bold text-[#27a28c]">
                      {searchData.feedback.helpfulness_rate !== null ? `${searchData.feedback.helpfulness_rate}%` : "\u2014"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Helpfulness Rate</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                    <div className="text-2xl font-bold text-[#304256]">{searchData.feedback.total_positive}</div>
                    <div className="text-sm text-gray-400 mt-1">Thumbs Up</div>
                  </div>
                  <div className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                    <div className="text-2xl font-bold text-[#304256]">{searchData.feedback.total_negative}</div>
                    <div className="text-sm text-gray-400 mt-1">Thumbs Down</div>
                  </div>
                </div>

                {searchData.feedback.negative_queries.length > 0 && (
                  <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden mb-8">
                    <div className="px-5 py-4 border-b border-[#E8ECF1] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <h2 className="font-semibold text-[#304256]">Content Gaps</h2>
                      <span className="text-[10px] bg-red-50 text-red-600 rounded-full px-2 py-0.5 font-medium">
                        {searchData.feedback.negative_queries.length}
                      </span>
                    </div>
                    <p className="px-5 pt-3 text-xs text-gray-400">Questions that received negative feedback — consider adding or improving content for these topics</p>
                    <div className="max-h-[300px] overflow-y-auto">
                      {searchData.feedback.negative_queries.map((s) => (
                        <div key={s.query} className="px-5 py-2.5 border-b border-gray-100 last:border-b-0 flex items-center justify-between">
                          <span className="text-sm text-gray-800 truncate">{s.query}</span>
                          <span className="text-xs font-semibold text-red-500 tabular-nums">{s.count}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
