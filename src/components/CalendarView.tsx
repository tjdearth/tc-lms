"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CalendarEvent } from "@/types";
import { BRAND_NAMES, getBrandColor } from "@/lib/brands";

const EVENT_TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  public_holiday: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  festival: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  peak_season: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  low_season: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
  office_closure: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  custom: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  public_holiday: "Public Holiday",
  festival: "Festival",
  peak_season: "Peak Season",
  low_season: "Low Season",
  office_closure: "Office Closure",
  custom: "Custom",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const allBrands = BRAND_NAMES;

// Popover for showing event details on click
function EventPopover({
  events,
  anchorRect,
  onClose,
  onDelete,
}: {
  events: CalendarEvent[];
  anchorRect: { top: number; left: number; width: number; bottom: number };
  onClose: () => void;
  onDelete?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Position popover below the anchor, centered
  const style: React.CSSProperties = {
    position: "fixed",
    top: anchorRect.bottom + 4,
    left: Math.max(8, anchorRect.left + anchorRect.width / 2 - 160),
    width: 320,
    zIndex: 100,
  };

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      style={style}
    >
      <div className="max-h-[300px] overflow-y-auto">
        {events.map((ev) => {
          const colors = EVENT_TYPE_COLORS[ev.event_type] || EVENT_TYPE_COLORS.custom;
          const startDate = new Date(ev.date_start);
          const formattedDate = startDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          });
          return (
            <div key={ev.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0 group/popitem">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-gray-800 flex-1">{ev.title}</h4>
                <span className={`inline-block px-1.5 py-0.5 text-[10px] rounded-full ${colors.bg} ${colors.text}`}>
                  {EVENT_TYPE_LABELS[ev.event_type]}
                </span>
                {onDelete && (
                  <button
                    onClick={() => { if (confirm(`Delete "${ev.title}"?`)) onDelete(ev.id); }}
                    className="opacity-0 group-hover/popitem:opacity-100 text-gray-300 hover:text-red-500 transition-all p-0.5"
                    title="Delete event"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: getBrandColor(ev.brand) }}
                />
                <span>{ev.brand}</span>
                {ev.country && (
                  <>
                    <span>|</span>
                    <span>{ev.country}</span>
                  </>
                )}
                <span>|</span>
                <span>{formattedDate}</span>
              </div>
              {ev.impact_notes && (
                <p className="text-[11px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1.5 inline-block">
                  {ev.impact_notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarView({ events, onDelete }: { events: CalendarEvent[]; onDelete?: (id: string) => void }) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [currentYear] = useState(2026);
  const [isMobile, setIsMobile] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const [popover, setPopover] = useState<{ events: CalendarEvent[]; rect: { top: number; left: number; width: number; bottom: number } } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Force list view on mobile
  const effectiveViewMode = isMobile ? "list" : viewMode;

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedBrand !== "all") {
      filtered = filtered.filter((e) => e.brand === selectedBrand);
    }
    return [...filtered].sort(
      (a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()
    );
  }, [selectedBrand, events]);

  // Calendar grid helpers
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredEvents.filter((e) => {
      if (e.date_start === dateStr) return true;
      if (e.date_end) {
        return e.date_start <= dateStr && e.date_end >= dateStr;
      }
      return false;
    });
  };

  const exportToIcs = () => {
    const evts = filteredEvents;
    if (evts.length === 0) return;

    const escIcs = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
    const toIcsDate = (d: string) => d.replace(/-/g, "");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Travel Collection//Atlas Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:${selectedBrand === "all" ? "Travel Collection" : selectedBrand} Events`,
    ];

    for (const ev of evts) {
      const uid = `${ev.id}@travelcollection.com`;
      const dtStart = toIcsDate(ev.date_start);
      // For all-day events, DTEND should be day after last day
      const endDate = ev.date_end || ev.date_start;
      const nextDay = new Date(endDate + "T00:00:00");
      nextDay.setDate(nextDay.getDate() + 1);
      const dtEnd = nextDay.toISOString().slice(0, 10).replace(/-/g, "");

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${uid}`);
      lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
      lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
      lines.push(`SUMMARY:${escIcs(ev.title)}`);
      if (ev.impact_notes) lines.push(`DESCRIPTION:${escIcs(ev.impact_notes)}`);
      if (ev.country) lines.push(`LOCATION:${escIcs(ev.country)}`);
      lines.push(`CATEGORIES:${escIcs(ev.brand)}`);
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedBrand === "all" ? "travel-collection" : selectedBrand.toLowerCase().replace(/\s+/g, "-")}-events.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEventClick = (eventsToShow: CalendarEvent[], e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopover({
      events: eventsToShow,
      rect: { top: rect.top, left: rect.left, width: rect.width, bottom: rect.bottom },
    });
  };

  return (
    <div>
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
        {/* Brand filter */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
        >
          <option value="all">All Brands (16)</option>
          {allBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Export + View toggle */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            onClick={exportToIcs}
            disabled={filteredEvents.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-[#304256] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export to Google Calendar (.ics)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export .ics
          </button>
        </div>
        <div className="hidden md:flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "list"
                ? "bg-white text-navy font-medium shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === "calendar"
                ? "bg-white text-navy font-medium shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 md:gap-4 mb-6">
        {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => {
          const colors = EVENT_TYPE_COLORS[type];
          return (
            <div key={type} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          );
        })}
      </div>

      {effectiveViewMode === "list" ? (
        /* List View — grouped by month, past collapsed */
        (() => {
          if (filteredEvents.length === 0) {
            return <p className="text-gray-400 text-sm py-8 text-center">No events found.</p>;
          }

          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

          // Group events by YYYY-MM
          const grouped: Record<string, CalendarEvent[]> = {};
          filteredEvents.forEach((e) => {
            const key = e.date_start.slice(0, 7); // "YYYY-MM"
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(e);
          });
          const monthKeys = Object.keys(grouped).sort();

          const pastKeys = monthKeys.filter((k) => k < currentMonthKey);
          const currentAndFutureKeys = monthKeys.filter((k) => k >= currentMonthKey);
          const totalPastEvents = pastKeys.reduce((sum, k) => sum + grouped[k].length, 0);

          const renderEvent = (event: CalendarEvent, isPast: boolean) => {
            const colors = EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.custom;
            const startDate = new Date(event.date_start);
            const dateStr = startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
            const endDateStr = event.date_end
              ? new Date(event.date_end).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
              : null;

            return (
              <div
                key={event.id}
                className={`flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors group/row ${isPast ? "opacity-50" : ""}`}
              >
                {/* Type dot + date */}
                <div className="flex items-center gap-2 flex-shrink-0 w-24">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                  <span className="text-xs text-gray-500 tabular-nums">{dateStr}</span>
                  {endDateStr && <span className="text-[10px] text-gray-300">– {endDateStr}</span>}
                </div>
                {/* Title + brand */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-800 truncate">{event.title}</span>
                  <span className={`flex-shrink-0 px-1.5 py-0.5 text-[10px] rounded-full ${colors.bg} ${colors.text}`}>
                    {EVENT_TYPE_LABELS[event.event_type]}
                  </span>
                </div>
                {/* Brand + country */}
                <div className="hidden sm:flex items-center gap-2 flex-shrink-0 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: getBrandColor(event.brand) }} />
                  <span className="truncate max-w-[120px]">{event.brand}</span>
                  {event.country && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{event.country}</span>
                    </>
                  )}
                </div>
                {/* Impact */}
                {event.impact_notes && (
                  <div className="hidden lg:block flex-shrink-0">
                    <span className="text-[10px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 max-w-[200px] truncate inline-block">
                      {event.impact_notes}
                    </span>
                  </div>
                )}
                {onDelete && (
                  <button
                    onClick={() => { if (confirm(`Delete "${event.title}"?`)) onDelete(event.id); }}
                    className="opacity-0 group-hover/row:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1 flex-shrink-0"
                    title="Delete event"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                )}
              </div>
            );
          };

          const renderMonthGroup = (monthKey: string, events: CalendarEvent[], isPast: boolean) => {
            const [y, m] = monthKey.split("-").map(Number);
            const monthLabel = `${MONTHS[m - 1]} ${y}`;
            const isCurrentMonth = monthKey === currentMonthKey;

            // Split current month at today
            let beforeToday: CalendarEvent[] = [];
            let afterToday: CalendarEvent[] = [];
            if (isCurrentMonth) {
              const todayStr = now.toISOString().slice(0, 10);
              beforeToday = events.filter((e) => e.date_start < todayStr);
              afterToday = events.filter((e) => e.date_start >= todayStr);
            }

            return (
              <div key={monthKey} className="mb-4">
                {/* Month header */}
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-sm font-semibold ${isPast ? "text-gray-400" : "text-navy"}`}>{monthLabel}</h3>
                  <span className="text-[10px] text-gray-300 bg-gray-100 rounded-full px-2 py-0.5">{events.length}</span>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {isCurrentMonth ? (
                    <>
                      {beforeToday.map((e) => renderEvent(e, true))}
                      {/* Today divider */}
                      <div className="flex items-center gap-3 px-4 py-1.5 bg-[#27a28c]/5">
                        <div className="w-2 h-2 rounded-full bg-[#27a28c]" />
                        <span className="text-[11px] font-semibold text-[#27a28c]">
                          Today — {now.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                        </span>
                        <div className="flex-1 border-t border-[#27a28c]/20" />
                      </div>
                      {afterToday.map((e) => renderEvent(e, false))}
                    </>
                  ) : (
                    events.map((e) => renderEvent(e, isPast))
                  )}
                </div>
              </div>
            );
          };

          return (
            <div>
              {/* Past events toggle */}
              {totalPastEvents > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowPast(!showPast)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors w-full"
                  >
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`transition-transform ${showPast ? "rotate-90" : ""}`}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Past Events</span>
                    <span className="text-[10px] text-gray-300 bg-white rounded-full px-2 py-0.5 border border-gray-200">{totalPastEvents}</span>
                  </button>
                  {showPast && (
                    <div className="mt-3 space-y-0">
                      {pastKeys.map((k) => renderMonthGroup(k, grouped[k], true))}
                    </div>
                  )}
                </div>
              )}

              {/* Current + future months */}
              {currentAndFutureKeys.map((k) => renderMonthGroup(k, grouped[k], false))}
            </div>
          );
        })()
      ) : (
        /* Calendar Grid View */
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
            <button
              onClick={() => setCurrentMonth((m) => (m === 0 ? 11 : m - 1))}
              className="p-1 hover:bg-gray-100 rounded text-gray-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h3 className="font-semibold text-navy">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={() => setCurrentMonth((m) => (m === 11 ? 0 : m + 1))}
              className="p-1 hover:bg-gray-100 rounded text-gray-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 border-b border-r border-gray-100" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const now = new Date();
              const isToday =
                day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
              return (
                <div
                  key={day}
                  className={`h-24 border-b border-r border-gray-100 p-1 ${isToday ? "bg-[#27a28c]/[0.06]" : ""}`}
                >
                  <div
                    className={`text-xs font-semibold mb-1 pl-1 ${
                      isToday ? "text-[#27a28c]" : "text-gray-600"
                    }`}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => {
                      const colors =
                        EVENT_TYPE_COLORS[ev.event_type] ||
                        EVENT_TYPE_COLORS.custom;
                      return (
                        <button
                          key={ev.id}
                          onClick={(e) => handleEventClick([ev], e)}
                          className={`w-full text-left text-[10px] truncate px-1 rounded cursor-pointer hover:opacity-80 transition-opacity ${colors.bg} ${colors.text}`}
                        >
                          {ev.title}
                        </button>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <button
                        onClick={(e) => handleEventClick(dayEvents, e)}
                        className="text-[10px] text-gray-400 px-1 hover:text-gray-600 cursor-pointer"
                      >
                        +{dayEvents.length - 2} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event detail popover */}
      {popover && (
        <EventPopover
          events={popover.events}
          anchorRect={popover.rect}
          onClose={() => setPopover(null)}
          onDelete={onDelete ? (id) => { onDelete(id); setPopover(null); } : undefined}
        />
      )}
    </div>
  );
}
