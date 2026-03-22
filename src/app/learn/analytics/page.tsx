"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import { isCourseCreator } from "@/lib/admin";
import { getBrandColor } from "@/lib/brands";

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
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const hasAccess = status === "authenticated" && isCourseCreator(session?.user?.email || "");

  useEffect(() => {
    if (!hasAccess) return;
    fetch("/api/learn/analytics")
      .then((r) => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hasAccess]);

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
                { label: "Avg Quiz Score", value: data.overview.avg_quiz_score !== null ? `${data.overview.avg_quiz_score}%` : "—" },
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
          </>
        )}
      </div>
    </AppShell>
  );
}
