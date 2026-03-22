"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/AppShell";
import CalendarView from "@/components/CalendarView";
import { fetchCalendarEvents } from "@/lib/api";
import { CalendarEvent } from "@/types";
import { BRAND_NAMES, getBrandColor } from "@/lib/brands";

interface DiscoveredEvent {
  title: string;
  date_start: string;
  date_end: string | null;
  event_type: string;
  description: string | null;
  impact_notes: string | null;
  country: string;
  brand: string;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  public_holiday: "Public Holiday",
  festival: "Festival",
  peak_season: "Peak Season",
  low_season: "Low Season",
  office_closure: "Office Closure",
  custom: "Other",
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  public_holiday: "bg-blue-50 text-blue-700 border-blue-200",
  festival: "bg-purple-50 text-purple-700 border-purple-200",
  peak_season: "bg-orange-50 text-orange-700 border-orange-200",
  low_season: "bg-cyan-50 text-cyan-700 border-cyan-200",
  custom: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Discover state
  const [showDiscover, setShowDiscover] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchYear, setSearchYear] = useState(new Date().getFullYear());
  const [discovering, setDiscovering] = useState(false);
  const [discoveredEvents, setDiscoveredEvents] = useState<DiscoveredEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Set<number>>(new Set());
  const [adding, setAdding] = useState(false);
  const [discoverError, setDiscoverError] = useState("");
  const [addedCount, setAddedCount] = useState(0);

  const loadEvents = useCallback(() => {
    fetchCalendarEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDiscover = async () => {
    if (!selectedBrand) return;
    setDiscovering(true);
    setDiscoveredEvents([]);
    setSelectedEvents(new Set());
    setDiscoverError("");
    setAddedCount(0);

    try {
      const res = await fetch("/api/calendar/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: selectedBrand, year: searchYear }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Discovery failed");
      setDiscoveredEvents(data.events || []);
    } catch (err) {
      setDiscoverError(err instanceof Error ? err.message : "Discovery failed");
    } finally {
      setDiscovering(false);
    }
  };

  const toggleEvent = (idx: number) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedEvents.size === discoveredEvents.length) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(discoveredEvents.map((_, i) => i)));
    }
  };

  const handleAddSelected = async () => {
    const toAdd = discoveredEvents.filter((_, i) => selectedEvents.has(i));
    if (toAdd.length === 0) return;
    setAdding(true);
    try {
      const res = await fetch("/api/calendar/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: toAdd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add events");
      setAddedCount(data.added || toAdd.length);
      // Remove added events from the list
      setDiscoveredEvents((prev) => prev.filter((_, i) => !selectedEvents.has(i)));
      setSelectedEvents(new Set());
      // Refresh calendar
      loadEvents();
    } catch (err) {
      setDiscoverError(err instanceof Error ? err.message : "Failed to add events");
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy mb-1">
              Holidays &amp; Festivals Calendar
            </h1>
            <p className="text-gray-500">
              Key dates across all 16 DMC brands. Plan ahead for holidays, peak
              seasons, and cultural events.
            </p>
          </div>
          <button
            onClick={() => setShowDiscover(!showDiscover)}
            className="flex items-center gap-2 px-4 py-2 bg-[#304256] text-white text-sm font-medium rounded-lg hover:bg-[#3d5570] transition-colors whitespace-nowrap"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 2a2.5 2.5 0 0 1 2.5 2.5v.5a2.5 2.5 0 0 1-2.5 2.5h-.5a2.5 2.5 0 0 1-2.5-2.5V4.5A2.5 2.5 0 0 1 9 2" />
              <path d="M15 2a2.5 2.5 0 0 0-2.5 2.5v.5A2.5 2.5 0 0 0 15 7.5h.5A2.5 2.5 0 0 0 18 5V4.5A2.5 2.5 0 0 0 15.5 2" />
              <path d="M6.5 7a2.5 2.5 0 0 0-2.5 2.5v.5a2.5 2.5 0 0 0 2.5 2.5h.5A2.5 2.5 0 0 0 9.5 10V9.5A2.5 2.5 0 0 0 7 7" />
              <path d="M17.5 7a2.5 2.5 0 0 1 2.5 2.5v.5a2.5 2.5 0 0 1-2.5 2.5h-.5A2.5 2.5 0 0 1 14.5 10V9.5A2.5 2.5 0 0 1 17 7" />
              <path d="M8 12.5a2.5 2.5 0 0 0-2.5 2.5v.5A2.5 2.5 0 0 0 8 18h.5a2.5 2.5 0 0 0 2.5-2.5v-.5A2.5 2.5 0 0 0 8.5 12.5" />
              <path d="M16 12.5a2.5 2.5 0 0 1 2.5 2.5v.5A2.5 2.5 0 0 1 16 18h-.5a2.5 2.5 0 0 1-2.5-2.5v-.5a2.5 2.5 0 0 1 2.5-2.5" />
              <path d="M10 18a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 10 23h4a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 14 18" />
            </svg>
            AI Event Discovery
          </button>
        </div>

        {/* AI Discovery Panel */}
        {showDiscover && (
          <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#304256] to-[#27a28c] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2a2.5 2.5 0 0 1 2.5 2.5v.5a2.5 2.5 0 0 1-2.5 2.5h-.5a2.5 2.5 0 0 1-2.5-2.5V4.5A2.5 2.5 0 0 1 9 2" />
                  <path d="M15 2a2.5 2.5 0 0 0-2.5 2.5v.5A2.5 2.5 0 0 0 15 7.5h.5A2.5 2.5 0 0 0 18 5V4.5A2.5 2.5 0 0 0 15.5 2" />
                  <path d="M6.5 7a2.5 2.5 0 0 0-2.5 2.5v.5a2.5 2.5 0 0 0 2.5 2.5h.5A2.5 2.5 0 0 0 9.5 10V9.5A2.5 2.5 0 0 0 7 7" />
                  <path d="M17.5 7a2.5 2.5 0 0 1 2.5 2.5v.5a2.5 2.5 0 0 1-2.5 2.5h-.5A2.5 2.5 0 0 1 14.5 10V9.5A2.5 2.5 0 0 1 17 7" />
                  <path d="M12 12v10" />
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#304256]">AI Event Discovery</h3>
                <p className="text-xs text-gray-400">Uses AI to deeply research your destination — surfacing local festivals, national holidays, peak travel seasons, cultural events, and anything that could impact bookings, pricing, or operations. Select what matters and add it to your calendar.</p>
              </div>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">DMC Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c]"
                >
                  <option value="">Select a brand...</option>
                  {BRAND_NAMES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="w-28">
                <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                <select
                  value={searchYear}
                  onChange={(e) => setSearchYear(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c]"
                >
                  {[2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleDiscover}
                disabled={!selectedBrand || discovering}
                className="px-5 py-2 bg-[#27a28c] text-white text-sm font-medium rounded-lg hover:bg-[#1f8a76] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {discovering ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Researching...
                  </span>
                ) : (
                  "Discover Events"
                )}
              </button>
            </div>

            {/* Error */}
            {discoverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">
                {discoverError}
              </div>
            )}

            {/* Added confirmation */}
            {addedCount > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 mb-4">
                ✓ {addedCount} event{addedCount !== 1 ? "s" : ""} added to the calendar.
              </div>
            )}

            {/* Loading state */}
            {discovering && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-[#27a28c] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-500">Researching events for {selectedBrand}...</p>
                <p className="text-xs text-gray-400 mt-1">This may take 15-30 seconds</p>
              </div>
            )}

            {/* Results */}
            {discoveredEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getBrandColor(selectedBrand) }}
                    />
                    <span className="text-sm font-medium text-[#304256]">
                      {discoveredEvents.length} events found
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAll}
                      className="text-xs text-[#27a28c] hover:underline"
                    >
                      {selectedEvents.size === discoveredEvents.length ? "Deselect all" : "Select all"}
                    </button>
                    {selectedEvents.size > 0 && (
                      <button
                        onClick={handleAddSelected}
                        disabled={adding}
                        className="px-4 py-1.5 bg-[#27a28c] text-white text-xs font-medium rounded-lg hover:bg-[#1f8a76] transition-colors disabled:opacity-50"
                      >
                        {adding ? "Adding..." : `Add ${selectedEvents.size} to Calendar`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
                  {discoveredEvents.map((event, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedEvents.has(idx) ? "bg-[#f0faf8]" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEvents.has(idx)}
                        onChange={() => toggleEvent(idx)}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#27a28c] focus:ring-[#27a28c]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#304256]">{event.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.custom}`}>
                            {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
                          <span>
                            {formatDate(event.date_start)}
                            {event.date_end ? ` — ${formatDate(event.date_end)}` : ""}
                          </span>
                          <span>{event.country}</span>
                        </div>
                        {event.description && (
                          <p className="text-xs text-gray-500 leading-relaxed">{event.description}</p>
                        )}
                        {event.impact_notes && (
                          <p className="text-xs text-amber-600 mt-1">
                            <span className="font-medium">Impact:</span> {event.impact_notes}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
