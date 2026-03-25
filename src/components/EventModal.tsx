"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarEvent } from "@/types";
import { BRAND_NAMES } from "@/lib/brands";

const EVENT_TYPES = [
  { value: "public_holiday", label: "Public Holiday" },
  { value: "festival", label: "Festival" },
  { value: "peak_season", label: "Peak Season" },
  { value: "low_season", label: "Low Season" },
  { value: "office_closure", label: "Office Closure" },
  { value: "custom", label: "Custom" },
];

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => Promise<void>;
  /** If provided, we are editing an existing event */
  event?: CalendarEvent | null;
  /** In DMC mode, lock brand to this value */
  lockedBrand?: string;
  /** True if user is admin (can pick any brand in TC mode) */
  isAdminUser?: boolean;
}

export interface EventFormData {
  id?: string;
  title: string;
  event_type: string;
  date_start: string;
  date_end: string;
  description: string;
  brand: string;
}

export default function EventModal({
  open,
  onClose,
  onSave,
  event,
  lockedBrand,
  isAdminUser,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("custom");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState(lockedBrand || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);

  const isEditing = !!event;

  // Populate form when editing
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setEventType(event.event_type);
      setDateStart(event.date_start);
      setDateEnd(event.date_end || "");
      setDescription(event.description || "");
      setBrand(event.brand);
    } else {
      setTitle("");
      setEventType("custom");
      setDateStart("");
      setDateEnd("");
      setDescription("");
      setBrand(lockedBrand || "");
    }
    setError("");
  }, [event, open, lockedBrand]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Event name is required.");
      return;
    }
    if (!dateStart) {
      setError("Start date is required.");
      return;
    }
    if (!brand) {
      setError("Brand is required.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        id: event?.id,
        title: title.trim(),
        event_type: eventType,
        date_start: dateStart,
        date_end: dateEnd || "",
        description: description.trim(),
        brand,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECF1]">
          <h2 className="text-lg font-semibold text-[#304256]">
            {isEditing ? "Edit Event" : "Add Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Event Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Event Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. National Day, Ramadan, Peak Summer Season"
              className="w-full border border-[#E8ECF1] rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30"
              autoFocus
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full border border-[#E8ECF1] rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="w-full border border-[#E8ECF1] rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                End Date <span className="text-gray-300">(optional)</span>
              </label>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                min={dateStart || undefined}
                className="w-full border border-[#E8ECF1] rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Description <span className="text-gray-300">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add any notes about this event..."
              className="w-full border border-[#E8ECF1] rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30 resize-none"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
            {lockedBrand ? (
              <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#304256] bg-gray-50">
                {lockedBrand}
              </div>
            ) : isAdminUser ? (
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border border-[#E8ECF1] rounded-lg px-3 py-2 text-sm text-[#304256] focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30"
              >
                <option value="">Select a brand...</option>
                {BRAND_NAMES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            ) : (
              <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#304256] bg-gray-50">
                {brand || "No brand assigned"}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#27a28c] text-white text-sm font-medium rounded-lg hover:bg-[#1f8a76] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Add Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
