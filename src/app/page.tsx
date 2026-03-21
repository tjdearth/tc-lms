"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import { fetchWikiTree, fetchCalendarEvents, getAllArticles } from "@/lib/api";
import { WikiNode, CalendarEvent, Course } from "@/types";

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

export default function DashboardPage() {
  const [wikiTree, setWikiTree] = useState<WikiNode[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(getRandomQuote);

  useEffect(() => {
    Promise.all([
      fetchWikiTree(),
      fetchCalendarEvents(),
      fetch("/api/learn/courses").then((r) => r.ok ? r.json() : []),
    ]).then(([tree, events, courses]) => {
      setWikiTree(tree);
      setCalendarEvents(events);
      setCourseCount((courses as Course[]).length);
      setLoading(false);
    });
  }, []);

  const allArticles = getAllArticles(wikiTree);

  // Upcoming events (next 30 days from today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

  const upcomingEvents = calendarEvents
    .filter((e) => {
      const start = new Date(e.date_start);
      return start >= today && start <= thirtyDaysLater;
    })
    .sort(
      (a, b) =>
        new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );

  const stats = [
    { label: "Wiki Articles", value: allArticles.length },
    { label: "DMC Brands & Countries", value: "16 brands · 22 countries" },
    { label: "Learn Courses", value: courseCount },
    { label: "Calendar Events", value: calendarEvents.length },
  ];

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px]">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy mb-1">
            Welcome to Atlas
          </h1>
          <p className="text-gray-500">
            Your hub for Travel Collection knowledge, processes, skills, and continuous learning.
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
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className={`font-bold text-navy ${typeof stat.value === "string" ? "text-sm mt-1" : "text-2xl"}`}>
                {loading ? "—" : stat.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent articles */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy">Recent Wiki Articles</h2>
              <Link
                href="/wiki"
                className="text-sm text-accent hover:underline"
              >
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
                    <p className="text-sm font-medium text-gray-800">
                      {article.title}
                    </p>
                    {article.search_text && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        {article.search_text}
                      </p>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy">
                Upcoming Events (30 days)
              </h2>
              <Link
                href="/calendar"
                className="text-sm text-accent hover:underline"
              >
                View calendar
              </Link>
            </div>
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No upcoming events in the next 30 days.
                </p>
              ) : (
                upcomingEvents.map((event) => {
                  const colors =
                    EVENT_TYPE_COLORS[event.event_type] ||
                    EVENT_TYPE_COLORS.custom;
                  const date = new Date(event.date_start);
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <span
                          className={`block w-2.5 h-2.5 rounded-full ${colors.dot}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-400">
                            {date.toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="text-xs text-gray-300">|</span>
                          <span className="text-xs text-gray-400">
                            {event.brand}
                          </span>
                          {event.country && (
                            <>
                              <span className="text-xs text-gray-300">|</span>
                              <span className="text-xs text-gray-400">
                                {event.country}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
