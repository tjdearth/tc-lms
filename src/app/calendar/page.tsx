"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import CalendarView from "@/components/CalendarView";
import { fetchCalendarEvents } from "@/lib/api";
import { CalendarEvent } from "@/types";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy mb-1">
            Holidays &amp; Festivals Calendar
          </h1>
          <p className="text-gray-500">
            Key dates across all 15 DMC brands. Plan ahead for holidays, peak
            seasons, and cultural events.
          </p>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-accent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading events...</p>
          </div>
        ) : (
          <CalendarView events={events} />
        )}
      </div>
    </AppShell>
  );
}
