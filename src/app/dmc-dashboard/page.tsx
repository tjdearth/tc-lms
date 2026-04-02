"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import { brandFromEmail, getBrandColor } from "@/lib/brands";
import { isAdmin } from "@/lib/admin";

const ALL_DMC_BRANDS = [
  "Authenticus Italy",
  "Unbox Spain & Portugal",
  "Truly Swahili",
  "Across Mexico",
  "Kembali Asia",
  "Majlis Retreats",
  "Crown Journey",
  "Oshinobi Travel",
  "Essentially French",
  "Elura Australia",
  "Nira Thailand",
  "Sar Turkiye",
  "Nostos Greece",
  "Vista Colombia",
  "Awaken Peru",
  "Experience Morocco",
];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  enrolled: number;
  completed: number;
  avg_quiz_score: number | null;
  overdue: number;
}

interface CourseCompletion {
  id: string;
  title: string;
  code: string;
  enrolled: number;
  completed: number;
  completion_pct: number;
}

interface OverdueAlert {
  user_name: string;
  user_email: string;
  course_title: string;
  due_date: string;
  days_overdue: number;
}

interface DashboardData {
  stats: {
    total_members: number;
    in_progress: number;
    completed: number;
    avg_quiz_score: number | null;
  };
  team_members: TeamMember[];
  course_completion: CourseCompletion[];
  overdue_alerts: OverdueAlert[];
}

export default function DMCDashboardPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const userEmail = session?.user?.email || "";
  const userBrand = userEmail ? brandFromEmail(userEmail) : null;
  const userIsAdmin = isAdmin(userEmail);
  const isDMC = userBrand && userBrand !== "Travel Collection";

  // The active brand: admin's selection, or the user's own brand
  const activeBrand = userIsAdmin ? (selectedBrand || ALL_DMC_BRANDS[0]) : userBrand;
  const brandColor = activeBrand ? getBrandColor(activeBrand) : "#304256";

  // Set initial brand for admins
  useEffect(() => {
    if (userIsAdmin && !selectedBrand) {
      setSelectedBrand(ALL_DMC_BRANDS[0]);
    }
  }, [userIsAdmin, selectedBrand]);

  useEffect(() => {
    if (status !== "authenticated" || !activeBrand) return;
    setLoading(true);
    fetch(`/api/dmc-dashboard?brand=${encodeURIComponent(activeBrand)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, activeBrand]);

  if (status === "loading") {
    return (
      <AppShell>
        <div className="p-8">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin mx-auto mt-20" />
        </div>
      </AppShell>
    );
  }

  // Not a DMC user and not an admin
  if (!isDMC && !userIsAdmin) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="bg-white rounded-xl border border-[#E8ECF1] p-8 text-center max-w-md">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7D8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#304256] mb-2">DMC Dashboard</h2>
            <p className="text-sm text-gray-500">
              DMC Dashboard is available for DMC team members. Your account is associated with Travel Collection HQ.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const statItems = [
    {
      label: "Team Members",
      value: data?.stats.total_members ?? "—",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "In Progress",
      value: data?.stats.in_progress ?? "—",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: data?.stats.completed ?? "—",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Avg Quiz Score",
      value: data?.stats.avg_quiz_score !== null && data?.stats.avg_quiz_score !== undefined ? `${data.stats.avg_quiz_score}%` : "—",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: brandColor }} />
            <h1 className="text-2xl font-bold text-[#304256]">{activeBrand} Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-500">Team learning progress and performance overview</p>
            {userIsAdmin && (
              <select
                value={selectedBrand || ""}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-1.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white"
              >
                {ALL_DMC_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loading || !data ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statItems.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-[#E8ECF1] p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${brandColor}15` }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#304256]">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Team Learning Progress */}
            <div className="bg-white rounded-xl border border-[#E8ECF1] mb-8 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8ECF1]">
                <h2 className="font-semibold text-[#304256]">Team Learning Progress</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                      <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500">Enrolled</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500">Completed</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Score</th>
                      <th className="text-right px-5 py-3 font-medium text-gray-500">Overdue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.team_members.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                          No team members found
                        </td>
                      </tr>
                    ) : (
                      data.team_members.map((member) => (
                        <tr key={member.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                          <td className="px-5 py-3">
                            <div className="font-medium text-gray-800">{member.name}</div>
                            <div className="text-xs text-gray-400">{member.email}</div>
                          </td>
                          <td className="px-5 py-3 text-right text-gray-600 tabular-nums">{member.enrolled}</td>
                          <td className="px-5 py-3 text-right text-gray-600 tabular-nums">{member.completed}</td>
                          <td className="px-5 py-3 text-right tabular-nums">
                            {member.avg_quiz_score !== null ? (
                              <span className={`font-semibold ${member.avg_quiz_score >= 80 ? "text-emerald-600" : member.avg_quiz_score >= 60 ? "text-amber-600" : "text-red-500"}`}>
                                {member.avg_quiz_score}%
                              </span>
                            ) : (
                              <span className="text-gray-300">--</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {member.overdue > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-600">
                                {member.overdue}
                              </span>
                            ) : (
                              <span className="text-gray-300">0</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Course Completion Rates */}
              <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8ECF1]">
                  <h2 className="font-semibold text-[#304256]">Course Completion Rates</h2>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {data.course_completion.length === 0 ? (
                    <div className="px-5 py-8 text-center text-gray-400 text-sm">
                      No course enrollments yet
                    </div>
                  ) : (
                    <div>
                      {data.course_completion.map((course) => (
                        <div key={course.id} className="px-5 py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-gray-800 truncate flex-1 mr-3">
                              {course.title}
                            </span>
                            <span className={`text-xs font-semibold tabular-nums ${course.completion_pct >= 70 ? "text-emerald-600" : course.completion_pct >= 40 ? "text-amber-600" : "text-red-500"}`}>
                              {course.completion_pct}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${course.completion_pct}%`,
                                  backgroundColor: brandColor,
                                }}
                              />
                            </div>
                            <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">
                              {course.completed}/{course.enrolled}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Overdue Alerts */}
              <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E8ECF1] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <h2 className="font-semibold text-[#304256]">Overdue Alerts</h2>
                  {data.overdue_alerts.length > 0 && (
                    <span className="text-[10px] bg-red-50 text-red-600 rounded-full px-2 py-0.5 font-medium">
                      {data.overdue_alerts.length}
                    </span>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {data.overdue_alerts.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <div className="text-2xl mb-2">&#10003;</div>
                      <p className="text-sm text-gray-400">No overdue courses -- great job, team!</p>
                    </div>
                  ) : (
                    <div>
                      {data.overdue_alerts.map((alert, i) => (
                        <div key={i} className="px-5 py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-800">{alert.user_name}</p>
                              <p className="text-xs text-gray-400">{alert.user_email}</p>
                            </div>
                            <span className="text-xs font-semibold text-red-500">{alert.days_overdue}d overdue</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{alert.course_title}</p>
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
