"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import CourseCard from "@/components/CourseCard";
import { useBrand } from "@/lib/brand-context";
import type { LmsUser, Course, Enrollment, MicroLesson } from "@/types";
import { getVideoThumbnail } from "@/lib/video";

export default function LearnDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const { brand } = useBrand();
  const [user, setUser] = useState<LmsUser | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [microLessons, setMicroLessons] = useState<MicroLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch user
        const userRes = await fetch("/api/learn/users");
        const userData: LmsUser = await userRes.json();
        setUser(userData);

        // Redirect to onboarding if not onboarded
        if (!userData.onboarded_at) {
          router.push("/learn/onboarding");
          return;
        }

        // Fetch courses, enrollments, and micro-lessons
        const brandParam = brand.mode === "tc" ? "tc" : brand.mode;
        const [coursesRes, enrollmentsRes, microRes] = await Promise.all([
          fetch("/api/learn/courses"),
          fetch("/api/learn/enroll"),
          fetch(`/api/learn/micro-lessons?brand=${encodeURIComponent(brandParam)}`),
        ]);
        const coursesData: Course[] = await coursesRes.json();
        const enrollmentsData: Enrollment[] = await enrollmentsRes.json();
        const microData = await microRes.json();

        setCourses(coursesData.filter((c) => c.is_published));
        setEnrollments(enrollmentsData);
        if (Array.isArray(microData)) setMicroLessons(microData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, brand.mode]);

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!user) return null;

  const enrollmentMap = new Map(enrollments.map((e) => [e.course_id, e]));

  const enrolledCourses = courses.filter((c) => enrollmentMap.has(c.id));

  // Required: enrolled but not completed, sorted by due date (urgent first)
  const requiredCourses = enrolledCourses
    .filter((c) => {
      const e = enrollmentMap.get(c.id)!;
      return e.status !== "completed" && e.due_date;
    })
    .sort((a, b) => {
      const aDue = enrollmentMap.get(a.id)!.due_date || "";
      const bDue = enrollmentMap.get(b.id)!.due_date || "";
      return aDue.localeCompare(bDue);
    });

  // Continue: in progress courses
  const continueCourses = enrolledCourses.filter(
    (c) => enrollmentMap.get(c.id)!.status === "in_progress"
  );

  // Completed count
  const completedCount = enrolledCourses.filter(
    (c) => enrollmentMap.get(c.id)!.status === "completed"
  ).length;

  // Suggested: published courses not enrolled, matching user track
  const suggestedCourses = courses
    .filter(
      (c) =>
        !enrollmentMap.has(c.id) &&
        user.track &&
        c.tracks.includes(user.track)
    )
    .slice(0, 4);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function getDueBadge(enrollment: Enrollment) {
    if (!enrollment.due_date) return null;
    const now = new Date();
    const due = new Date(enrollment.due_date);
    const diffDays = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0)
      return (
        <span className="px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded-full">
          Overdue
        </span>
      );
    if (diffDays <= 7)
      return (
        <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-700 rounded-full">
          Due soon
        </span>
      );
    return (
      <span className="px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">
        On track
      </span>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#304256]">
              Welcome back, {user.name || session?.user?.name || "Learner"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{today}</p>
          </div>

          {/* Required Learning */}
          {requiredCourses.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold text-[#304256]">
                  Required Learning
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded-full">
                  {requiredCourses.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {requiredCourses.map((course) => {
                  const enrollment = enrollmentMap.get(course.id)!;
                  return (
                    <div key={course.id} className="relative">
                      <div className="absolute top-2 right-2 z-10">
                        {getDueBadge(enrollment)}
                      </div>
                      <CourseCard
                        course={course}
                        enrollment={enrollment}
                        progressPct={course.progress_pct}
                        onClick={() =>
                          router.push(`/learn/course/${course.id}`)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Continue Learning */}
          {continueCourses.length > 0 && (
            <section className="mb-10">
              <h2 className="text-base font-semibold text-[#304256] mb-4">
                Continue Learning
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {continueCourses.map((course) => (
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
            </section>
          )}

          {/* Suggested Courses */}
          {suggestedCourses.length > 0 && (
            <section className="mb-10">
              <h2 className="text-base font-semibold text-[#304256] mb-4">
                Suggested for You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {suggestedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() =>
                      router.push(`/learn/course/${course.id}`)
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {/* Your Learning Track */}
          {enrolledCourses.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-[#304256]">
                    Your Learning Track
                  </h2>
                  {user.track && (
                    <span className="px-2.5 py-0.5 text-[10px] font-medium bg-[#27a28c]/10 text-[#27a28c] rounded-full">
                      {user.track === "both" ? "TA + Ops" : user.track === "travel_advisor" ? "Travel Advisor" : user.track === "operations" ? "Operations" : "General"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {completedCount} of {enrolledCourses.length} completed
                </p>
              </div>
              <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden">
                {/* Progress bar */}
                <div className="h-1.5 bg-gray-100">
                  <div
                    className="h-full bg-[#27a28c] transition-all"
                    style={{ width: `${enrolledCourses.length > 0 ? Math.round((completedCount / enrolledCourses.length) * 100) : 0}%` }}
                  />
                </div>
                <div className="divide-y divide-[#E8ECF1]">
                  {enrolledCourses
                    .sort((a, b) => {
                      const statusOrder: Record<string, number> = { in_progress: 0, enrolled: 1, completed: 2 };
                      const aStatus = enrollmentMap.get(a.id)?.status || "enrolled";
                      const bStatus = enrollmentMap.get(b.id)?.status || "enrolled";
                      return (statusOrder[aStatus] ?? 1) - (statusOrder[bStatus] ?? 1);
                    })
                    .map((course) => {
                      const enrollment = enrollmentMap.get(course.id)!;
                      const isCompleted = enrollment.status === "completed";
                      const isInProgress = enrollment.status === "in_progress";
                      return (
                        <button
                          key={course.id}
                          onClick={() => router.push(`/learn/course/${course.id}`)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted ? "bg-[#27a28c]" : isInProgress ? "border-2 border-[#27a28c]" : "border-2 border-gray-200"
                          }`}>
                            {isCompleted && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                            {isInProgress && (
                              <div className="w-2 h-2 rounded-full bg-[#27a28c]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isCompleted ? "text-gray-400 line-through" : "text-[#304256]"}`}>
                              {course.title}
                            </p>
                            <p className="text-[11px] text-gray-400">{course.category}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getDueBadge(enrollment)}
                            {isCompleted ? (
                              <span className="text-[10px] font-medium text-[#27a28c]">Done</span>
                            ) : isInProgress ? (
                              <span className="text-[10px] font-medium text-[#304256]">{course.progress_pct || 0}%</span>
                            ) : (
                              <span className="text-[10px] text-gray-400">Not started</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </section>
          )}

          {/* Micro-Learning */}
          {microLessons.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">&#9889;</span>
                  <h2 className="text-base font-semibold text-[#304256]">Micro-Learning</h2>
                </div>
                <button
                  onClick={() => router.push("/learn/micro-learning")}
                  className="text-xs font-medium text-[#27a28c] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {microLessons.slice(0, 8).map((ml) => (
                  <button
                    key={ml.id}
                    onClick={() => router.push(`/learn/micro-learning/${ml.id}`)}
                    className="flex-shrink-0 w-[220px] bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow text-left group"
                  >
                    <div className="aspect-video bg-[#304256] relative flex items-center justify-center">
                      {(() => {
                        const thumbSrc = ml.thumbnail_url || getVideoThumbnail(ml.video_url, 300);
                        return thumbSrc ? (
                          <img src={thumbSrc} alt={ml.title} className="w-full h-full object-cover" />
                        ) : (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white/30">
                            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                          </svg>
                        );
                      })()}
                      <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span>&#9889;</span> 5 min
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-semibold text-[#304256] line-clamp-2 mb-1">{ml.title}</h3>
                      {ml.tags && ml.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ml.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 text-[9px] font-medium rounded-full" style={{ backgroundColor: "#e0f7f3", color: "#27a28c" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Quick links */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/learn/courses")}
              className="px-4 py-2 text-xs font-medium text-white bg-[#304256] rounded-lg hover:bg-[#304256]/90 transition-colors"
            >
              Browse All Courses
            </button>
            <button
              onClick={() => router.push("/learn/certificates")}
              className="px-4 py-2 text-xs font-medium text-[#304256] border border-[#E8ECF1] rounded-lg hover:bg-white transition-colors"
            >
              My Certificates
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
