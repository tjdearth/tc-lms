"use client";

import AppShell from "@/components/AppShell";
import CalendarView from "@/components/CalendarView";

export default function CalendarPage() {
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
        <CalendarView />
      </div>
    </AppShell>
  );
}
