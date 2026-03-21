"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import CourseBadge from "@/components/CourseBadge";
import type { Course, Enrollment } from "@/types";

export default function CertificatesPage() {
  useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch("/api/learn/courses"),
          fetch("/api/learn/enroll"),
        ]);
        const coursesData: Course[] = await coursesRes.json();
        const enrollmentsData: Enrollment[] = await enrollmentsRes.json();

        setCourses(coursesData);
        setEnrollments(enrollmentsData);
      } catch (err) {
        console.error("Certificates load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const courseMap = new Map(courses.map((c) => [c.id, c]));
  const completedEnrollments = enrollments
    .filter((e) => e.status === "completed" && e.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#304256]">
              My Certificates
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Certificates earned from completed courses
            </p>
          </div>

          {/* Certificates grid */}
          {completedEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEnrollments.map((enrollment) => {
                const course = courseMap.get(enrollment.course_id);
                if (!course) return null;
                return (
                  <CourseBadge
                    key={enrollment.id}
                    courseName={course.title}
                    completedAt={enrollment.completed_at!}
                    category={course.category}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-12 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4"
              >
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              <p className="text-sm font-medium text-[#304256] mb-1">
                No certificates yet
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Complete courses to earn certificates
              </p>
              <button
                onClick={() => router.push("/learn/courses")}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
