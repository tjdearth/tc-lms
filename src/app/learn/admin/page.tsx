"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { isCourseCreator } from "@/lib/admin";

interface CourseStats {
  id: string;
  title: string;
  code: string;
  category: string;
  is_published: boolean;
  enrolled_count: number;
  completed_count: number;
  avg_score: number;
}

interface Stats {
  total_users: number;
  total_enrollments: number;
  completed_enrollments: number;
  completion_rate: number;
  courses: CourseStats[];
}

export default function LearnAdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const userEmail = session?.user?.email || "";
  const hasAccess = isCourseCreator(userEmail);

  useEffect(() => {
    if (!hasAccess) { setLoading(false); return; }
    async function load() {
      try {
        const r = await fetch("/api/learn/admin/stats");
        if (r.ok) {
          setStats(await r.json());
        }
      } catch {
        // Network error — stats will remain null
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [hasAccess]);

  if (!hasAccess) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#eeeeee" }}>
          <div className="bg-white rounded-xl border border-[#E8ECF1] p-8 text-center max-w-md">
            <h2 className="text-lg font-semibold text-[#304256] mb-2">Access Denied</h2>
            <p className="text-sm text-gray-500">You don&apos;t have permission to access the Learn admin.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const refreshStats = async () => {
    const r = await fetch("/api/learn/admin/stats");
    setStats(await r.json());
  };

  const handleTogglePublish = async (courseId: string, currentPublished: boolean) => {
    await fetch("/api/learn/courses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: courseId, is_published: !currentPublished }),
    });
    refreshStats();
  };

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm('Delete "' + title + '"? This cannot be undone.')) return;
    await fetch("/api/learn/courses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: courseId }),
    });
    refreshStats();
  };

  const handleClone = async (courseId: string) => {
    const res = await fetch('/api/learn/courses/' + courseId + '/clone', { method: "POST" });
    if (res.ok) {
      const nc = await res.json();
      router.push('/learn/admin/course/' + nc.id);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#eeeeee" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#304256]">Learn Admin</h1>
              <p className="text-sm text-gray-500 mt-1">Manage courses, enrollments, and content</p>
            </div>
            <button onClick={() => router.push("/learn/admin/course/new")} className="px-5 py-2.5 bg-[#27a28c] text-white text-sm font-medium rounded-lg hover:bg-[#229980] transition-colors">
              + Create Course
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Users", value: stats.total_users },
                  { label: "Total Enrollments", value: stats.total_enrollments },
                  { label: "Completed", value: stats.completed_enrollments },
                  { label: "Completion Rate", value: stats.completion_rate + "%" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-[#E8ECF1] p-5 shadow-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</p>
                    <p className="text-2xl font-bold text-[#304256] mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-[#E8ECF1] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E8ECF1]">
                  <h2 className="text-base font-semibold text-[#304256]">Courses</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3">Code</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3 text-center">Enrolled</th>
                        <th className="px-6 py-3 text-center">Completed</th>
                        <th className="px-6 py-3 text-center">% Complete</th>
                        <th className="px-6 py-3 text-center">Published</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8ECF1]">
                      {(stats.courses || []).map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-[#304256]">{c.title}</td>
                          <td className="px-6 py-3 text-gray-500">{c.code}</td>
                          <td className="px-6 py-3 text-gray-500">{c.category}</td>
                          <td className="px-6 py-3 text-center">{c.enrolled_count}</td>
                          <td className="px-6 py-3 text-center">{c.completed_count}</td>
                          <td className="px-6 py-3 text-center text-gray-500">{c.enrolled_count > 0 ? Math.round((c.completed_count / c.enrolled_count) * 100) : 0}%</td>
                          <td className="px-6 py-3 text-center">
                            <button onClick={() => handleTogglePublish(c.id, c.is_published)} className={'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' + (c.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                              {c.is_published ? "Published" : "Draft"}
                            </button>
                          </td>
                          <td className="px-6 py-3 text-right space-x-2">
                            <button onClick={() => router.push('/learn/admin/course/' + c.id)} className="text-[#27a28c] hover:underline text-xs">Edit</button>
                            <button onClick={() => handleClone(c.id)} className="text-[#304256] hover:underline text-xs">Clone</button>
                            <button onClick={() => handleDelete(c.id, c.title)} className="text-red-500 hover:underline text-xs">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Failed to load stats.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
