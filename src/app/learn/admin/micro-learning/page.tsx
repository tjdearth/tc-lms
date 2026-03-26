"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import { useBrand } from "@/lib/brand-context";
import { isCourseCreator } from "@/lib/admin";
import type { MicroLesson } from "@/types";

export default function MicroLearningAdmin() {
  const router = useRouter();
  const { data: session } = useSession();
  const { brand } = useBrand();
  const [lessons, setLessons] = useState<MicroLesson[]>([]);
  const [loading, setLoading] = useState(true);

  const canAccess = isCourseCreator(session?.user?.email);

  useEffect(() => {
    if (!canAccess) return;
    const brandParam = brand.mode === "tc" ? "tc" : brand.mode;
    fetch(`/api/learn/micro-lessons?brand=${encodeURIComponent(brandParam)}&all=true`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLessons(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [brand.mode, canAccess]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this micro-lesson?")) return;
    try {
      await fetch(`/api/learn/micro-lessons?id=${id}`, { method: "DELETE" });
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  if (!canAccess) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <p className="text-gray-500 text-sm">You do not have permission to access this page.</p>
        </div>
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">&#9889;</span>
                <h1 className="text-2xl font-bold text-[#304256]">Micro-Learning Admin</h1>
              </div>
              <p className="text-sm text-gray-500">{lessons.length} micro-lesson{lessons.length !== 1 ? "s" : ""}</p>
            </div>
            <button
              onClick={() => router.push("/learn/admin/micro-learning/new")}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
            >
              + Create New
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden">
            {lessons.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-sm mb-4">No micro-lessons yet</p>
                <button
                  onClick={() => router.push("/learn/admin/micro-learning/new")}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#27a28c] rounded-lg"
                >
                  Create your first micro-lesson
                </button>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E8ECF1] bg-gray-50">
                    <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Sent</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8ECF1]">
                  {lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-[#304256]">{lesson.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {lesson.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full" style={{ backgroundColor: "#e0f7f3", color: "#27a28c" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {lesson.is_published ? (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">Published</span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded-full">Draft</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {lesson.sent_at ? (
                          <span className="text-[11px] text-gray-500">{new Date(lesson.sent_at).toLocaleDateString()}</span>
                        ) : (
                          <span className="text-[11px] text-gray-400">Not sent</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-gray-500">
                          {new Date(lesson.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/learn/admin/micro-learning/${lesson.id}`)}
                            className="px-2.5 py-1 text-[11px] font-medium text-[#304256] border border-[#E8ECF1] rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(lesson.id)}
                            className="px-2.5 py-1 text-[11px] font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
