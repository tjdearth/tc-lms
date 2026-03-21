"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import CourseCard from "@/components/CourseCard";
import type { Course, Enrollment } from "@/types";

const categories = [
  { key: "all", label: "All" },
  { key: "General Onboarding", label: "General Onboarding" },
  { key: "Salesforce Academy", label: "Salesforce Academy" },
  { key: "Travel Advisors", label: "Travel Advisors" },
  { key: "Best Practices", label: "Best Practices" },
];

const statusFilters = [
  { key: "all", label: "All" },
  { key: "my_courses", label: "My Courses" },
  { key: "required", label: "Required" },
  { key: "completed", label: "Completed" },
];

export default function CourseCatalog() {
  useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch("/api/learn/courses"),
          fetch("/api/learn/enroll"),
        ]);
        const coursesData: Course[] = await coursesRes.json();
        const enrollmentsData: Enrollment[] = await enrollmentsRes.json();

        setCourses(coursesData.filter((c) => c.is_published));
        setEnrollments(enrollmentsData);
      } catch (err) {
        console.error("Catalog load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const enrollmentMap = new Map(enrollments.map((e) => [e.course_id, e]));

  const filteredCourses = courses.filter((c) => {
    // Category filter
    if (activeCategory !== "all" && c.category !== activeCategory) return false;

    // Status filter
    if (activeStatus === "my_courses" && !enrollmentMap.has(c.id)) return false;
    if (activeStatus === "required") {
      const e = enrollmentMap.get(c.id);
      if (!e || !e.due_date || e.status === "completed") return false;
    }
    if (activeStatus === "completed") {
      const e = enrollmentMap.get(c.id);
      if (!e || e.status !== "completed") return false;
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesTitle = c.title.toLowerCase().includes(q);
      const matchesDesc = (c.description || "").toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc) return false;
    }

    return true;
  });

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#304256]">
              Course Catalog
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse all available courses
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm text-[#304256] bg-white border border-[#E8ECF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c] transition-colors"
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === cat.key
                    ? "bg-[#304256] text-white"
                    : "bg-white text-gray-500 border border-[#E8ECF1] hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status filter pills */}
          <div className="flex gap-2 mb-6">
            {statusFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveStatus(f.key)}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-full transition-colors ${
                  activeStatus === f.key
                    ? "bg-[#27a28c] text-white"
                    : "bg-white text-gray-500 border border-[#E8ECF1] hover:border-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
            </div>
          )}

          {/* Course grid */}
          {!loading && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollment={enrollmentMap.get(course.id)}
                  progressPct={course.progress_pct}
                  onClick={() =>
                    router.push(`/learn/course/${course.id}`)
                  }
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredCourses.length === 0 && (
            <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-12 text-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-3"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <p className="text-sm text-gray-500">
                No courses found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
