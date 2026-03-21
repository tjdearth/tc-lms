"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import Link from "next/link";
import { fetchWikiTree, fetchCalendarEvents, getAllArticles } from "@/lib/api";
import { WikiNode, CalendarEvent } from "@/types";

const EVENT_TYPE_COLORS: Record<string, { dot: string }> = {
  public_holiday: { dot: "bg-blue-500" },
  festival: { dot: "bg-purple-500" },
  peak_season: { dot: "bg-emerald-500" },
  low_season: { dot: "bg-gray-400" },
  office_closure: { dot: "bg-red-500" },
  custom: { dot: "bg-amber-500" },
};

export default function DashboardPage() {
  const [wikiTree, setWikiTree] = useState<WikiNode[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchWikiTree(), fetchCalendarEvents()]).then(
      ([tree, events]) => {
        setWikiTree(tree);
        setCalendarEvents(events);
        setLoading(false);
      }
    );
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
    { label: "DMC Brands", value: 16 },
    { label: "Countries", value: 22 },
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="text-2xl font-bold text-navy">
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
