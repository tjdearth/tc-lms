"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import { fetchWikiTree, fetchCalendarEvents, getAllArticles } from "@/lib/api";
import { WikiNode, CalendarEvent, Course, Enrollment } from "@/types";
import { brandFromEmail } from "@/lib/brands";

const EVENT_TYPE_COLORS: Record<string, { dot: string }> = {
  public_holiday: { dot: "bg-blue-500" },
  festival: { dot: "bg-purple-500" },
  peak_season: { dot: "bg-emerald-500" },
  low_season: { dot: "bg-gray-400" },
  office_closure: { dot: "bg-red-500" },
  custom: { dot: "bg-amber-500" },
};

const TRAVEL_QUOTES = [
  { text: "Traveling — it leaves you speechless, then turns you into a storyteller.", author: "Ibn Battuta" },
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "Travel is fatal to prejudice, bigotry, and narrow-mindedness.", author: "Mark Twain" },
  { text: "If you reject the food, ignore the customs, fear the religion, and avoid the people, you might better stay home.", author: "James Michener" },
  { text: "To travel is to discover that everyone is wrong about other countries.", author: "Aldous Huxley" },
  { text: "Travel isn't always pretty. It isn't always comfortable. But that's okay. The journey changes you.", author: "Anthony Bourdain" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.", author: "Marcel Proust" },
  { text: "Once a year, go someplace you've never been before.", author: "Dalai Lama" },
  { text: "Travel makes one modest. You see what a tiny place you occupy in the world.", author: "Gustave Flaubert" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "We travel not to escape life, but for life not to escape us.", author: "Anonymous" },
  { text: "I haven't been everywhere, but it's on my list.", author: "Susan Sontag" },
  { text: "The gladdest moment in human life is a departure into unknown lands.", author: "Sir Richard Burton" },
  { text: "One's destination is never a place, but a new way of seeing things.", author: "Henry Miller" },
  { text: "To move, to breathe, to fly, to float, to roam the roads of lands remote.", author: "John Keats" },
  { text: "Surely, of all the wonders of the world, the horizon is the greatest.", author: "Freya Stark" },
  { text: "Own only what you can always carry with you: know languages, know countries, know people.", author: "Aleksandr Solzhenitsyn" },
  { text: "Adventure is worthwhile in itself.", author: "Amelia Earhart" },
];

function getRandomQuote() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return TRAVEL_QUOTES[seed % TRAVEL_QUOTES.length];
}

function getDueStatus(enrollment: Enrollment): { label: string; color: string; bgColor: string } {
  if (enrollment.status === "completed") return { label: "Completed", color: "text-emerald-600", bgColor: "bg-emerald-50" };
  if (!enrollment.due_date) return { label: "On Track", color: "text-emerald-600", bgColor: "bg-emerald-50" };
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(enrollment.due_date);
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: "Overdue", color: "text-red-600", bgColor: "bg-red-50" };
  if (diffDays <= 7) return { label: "Due Soon", color: "text-amber-600", bgColor: "bg-amber-50" };
  return { label: "On Track", color: "text-emerald-600", bgColor: "bg-emerald-50" };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [wikiTree, setWikiTree] = useState<WikiNode[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(getRandomQuote);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchWikiTree(),
      fetchCalendarEvents(),
      fetch("/api/learn/courses").then((r) => r.ok ? r.json() : []),
      fetch("/api/learn/enroll").then((r) => r.ok ? r.json() : []),
    ]).then(([tree, events, coursesData, enrollData]) => {
      setWikiTree(tree);
      setCalendarEvents(events);
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      setEnrollments(Array.isArray(enrollData) ? enrollData : []);
      setLoading(false);
    });
  }, []);

  const allArticles = getAllArticles(wikiTree);
  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const userBrand = session?.user?.email ? brandFromEmail(session.user.email) : null;

  // Enrollment stats
  const inProgress = enrollments.filter((e) => e.status === "in_progress" || e.status === "enrolled").length;
  const completed = enrollments.filter((e) => e.status === "completed").length;

  // Active enrollments with course info (not completed, max 4)
  const activeEnrollments = enrollments
    .filter((e) => e.status !== "completed")
    .slice(0, 4)
    .map((e) => {
      const course = courses.find((c) => c.id === e.course_id);
      return { ...e, courseTitle: course?.title || "Untitled Course", courseCategory: course?.category || "" };
    });

  // Upcoming events (next 30 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
  const upcomingEvents = calendarEvents
    .filter((e) => {
      const start = new Date(e.date_start);
      return start >= today && start <= thirtyDaysLater;
    })
    .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());

  const stats = [
    { label: "In Progress", value: inProgress, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
      </svg>
    )},
    { label: "Completed", value: completed, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )},
    { label: "Wiki Articles", value: allArticles.length, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    )},
    { label: "Upcoming Events", value: (showAllEvents || !userBrand) ? upcomingEvents.length : upcomingEvents.filter((e) => e.brand === userBrand).length, icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )},
  ];

  const quickActions = [
    { label: "Browse Courses", href: "/learn/courses", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#304256" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
      </svg>
    )},
    { label: "Knowledge Base", href: "/wiki", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#304256" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    )},
    { label: "Calendar", href: "/calendar", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#304256" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )},
    { label: "Company", href: "/company", icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#304256" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )},
  ];

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px]">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy mb-1">
            Welcome back, {firstName}
          </h1>
          <p className="text-gray-500">
            Your hub for Travel Collection knowledge, processes, skills and continuous learning.
          </p>
        </div>

        {/* Travel Quote */}
        <div className="mb-8 px-6 py-8 bg-gradient-to-br from-[#304256] via-[#1e3044] to-[#0F1923] rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }} />
          <div className="relative">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-4 opacity-30">
              <path d="M3 21c3-3 4-8 4-14h4c0 6-1 11-4 14H3zm10 0c3-3 4-8 4-14h4c0 6-1 11-4 14h-4z" fill="white" />
            </svg>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed tracking-wide" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: "italic" }}>
              {quote.text}
            </p>
            <p className="mt-4 text-white/40 text-sm tracking-[0.15em] uppercase text-right" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              — {quote.author}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-[#27a28c]/10 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-navy">
                {loading ? "—" : stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Your Learning */}
        {!loading && activeEnrollments.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy">Your Learning</h2>
              <Link href="/learn/courses" className="text-sm text-accent hover:underline">
                Browse All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeEnrollments.map((e) => {
                const status = getDueStatus(e);
                const dueDate = e.due_date ? new Date(e.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;
                return (
                  <Link
                    key={e.id}
                    href={`/learn/course/${e.course_id}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-navy group-hover:text-accent transition-colors truncate">
                          {e.courseTitle}
                        </h3>
                        {e.courseCategory && (
                          <p className="text-[11px] text-gray-400 mt-0.5">{e.courseCategory}</p>
                        )}
                      </div>
                      <span className={`flex-shrink-0 px-2 py-0.5 text-[11px] font-medium rounded-full ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    {dueDate && (
                      <p className={`text-xs mt-2 ${status.label === "Overdue" ? "text-red-500" : status.label === "Due Soon" ? "text-amber-500" : "text-gray-400"}`}>
                        Due {dueDate}
                      </p>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-gray-400 capitalize">{e.status.replace("_", " ")}</span>
                      <span className="text-xs text-accent font-medium group-hover:underline">Continue &rarr;</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-sm hover:border-gray-300 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#27a28c]/10 transition-colors">
                {action.icon}
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-navy transition-colors">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Two-column: Recent Articles + Upcoming Events */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent articles */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy">Recent Wiki Articles</h2>
              <Link href="/wiki" className="text-sm text-accent hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
              ) : allArticles.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">No articles yet.</p>
              ) : (
                allArticles.slice(0, 6).map((article) => (
                  <Link
                    key={article.id}
                    href={`/wiki?article=${article.id}`}
                    className="block px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-800">{article.title}</p>
                    {article.search_text && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{article.search_text}</p>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-navy">
                  {showAllEvents || !userBrand ? "Upcoming Events" : `Upcoming — ${userBrand}`}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {userBrand && (
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showAllEvents ? `${userBrand} only` : "All brands"}
                  </button>
                )}
                <Link href="/calendar" className="text-sm text-accent hover:underline">
                  View calendar
                </Link>
              </div>
            </div>
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
              ) : (() => {
                const displayEvents = (showAllEvents || !userBrand)
                  ? upcomingEvents
                  : upcomingEvents.filter((e) => e.brand === userBrand);
                return displayEvents.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">
                    {userBrand && !showAllEvents
                      ? `No upcoming ${userBrand} events in the next 30 days.`
                      : "No upcoming events in the next 30 days."}
                  </p>
                ) : (
                  displayEvents.slice(0, 8).map((event) => {
                    const colors = EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.custom;
                    const date = new Date(event.date_start);
                    return (
                      <div key={event.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          <span className={`block w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{event.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400">
                              {date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </span>
                            {(showAllEvents || !userBrand) && (
                              <>
                                <span className="text-xs text-gray-300">|</span>
                                <span className="text-xs text-gray-400">{event.brand}</span>
                              </>
                            )}
                            {event.country && (
                              <>
                                <span className="text-xs text-gray-300">|</span>
                                <span className="text-xs text-gray-400">{event.country}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
