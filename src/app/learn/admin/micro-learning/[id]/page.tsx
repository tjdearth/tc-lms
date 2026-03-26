"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import { useBrand } from "@/lib/brand-context";
import { isAdmin, isCourseCreator } from "@/lib/admin";
import { BRAND_NAMES } from "@/lib/brands";
import type { MicroLesson } from "@/types";

function buildStandaloneEmailHtml(lesson: {
  title: string;
  key_points_html: string;
  video_url: string;
  id: string;
}): string {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://atlas.travelcollection.co";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <tr>
      <td style="background:#304256;padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Atlas <span style="color:#27a28c;font-weight:400;">&mdash; Micro-Learning</span></h1>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 0;">
        <div style="display:inline-block;background:#e0f7f3;color:#27a28c;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;letter-spacing:0.5px;">&#9889; 5 MIN LESSON</div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 8px;">
        <h2 style="margin:0;color:#304256;font-size:22px;font-weight:700;">${lesson.title}</h2>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 24px;">
        ${lesson.key_points_html}
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:12px;">
              <a href="${lesson.video_url}" style="display:inline-block;padding:12px 24px;background:#27a28c;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">&#9654; Watch the Full Video</a>
            </td>
            <td>
              <a href="${baseUrl}/learn/micro-learning/${lesson.id}" style="display:inline-block;padding:12px 24px;background:#304256;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">View in Atlas</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;background:#f4f5f7;color:#888;font-size:12px;text-align:center;">
        Travel Collection &mdash; Atlas
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default function MicroLessonEditor() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { brand } = useBrand();
  const isNew = params.id === "new";
  const lessonId = isNew ? null : (params.id as string);

  const canAccess = isCourseCreator(session?.user?.email);
  const userIsAdmin = isAdmin(session?.user?.email);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [transcript, setTranscript] = useState("");
  const [keyPointsHtml, setKeyPointsHtml] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [lessonBrand, setLessonBrand] = useState(brand.mode === "tc" ? "tc" : brand.mode);
  const [isPublished, setIsPublished] = useState(false);
  const [sentAt, setSentAt] = useState<string | null>(null);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(lessonId);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Load existing lesson
  useEffect(() => {
    if (!lessonId || isNew) return;
    fetch(`/api/learn/micro-lessons?all=true`)
      .then((r) => r.json())
      .then((data: MicroLesson[]) => {
        const found = data.find((l) => l.id === lessonId);
        if (found) {
          setTitle(found.title);
          setDescription(found.description || "");
          setVideoUrl(found.video_url);
          setTagsInput((found.tags || []).join(", "));
          setTranscript(found.transcript || "");
          setKeyPointsHtml(found.key_points_html || "");
          setThumbnailUrl(found.thumbnail_url || "");
          setLessonBrand(found.brand);
          setIsPublished(found.is_published);
          setSentAt(found.sent_at);
          setSavedId(found.id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [lessonId, isNew]);

  const parseTags = (): string[] => {
    return tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  };

  async function handleSave(publish: boolean) {
    if (!title.trim() || !videoUrl.trim()) {
      showToast("Title and video URL are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        video_url: videoUrl.trim(),
        transcript: transcript.trim() || null,
        key_points_html: keyPointsHtml || null,
        thumbnail_url: thumbnailUrl.trim() || null,
        tags: parseTags(),
        brand: lessonBrand,
        is_published: publish,
      };

      let res;
      if (savedId) {
        res = await fetch("/api/learn/micro-lessons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: savedId, ...payload }),
        });
      } else {
        res = await fetch("/api/learn/micro-lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Save failed");
        return;
      }

      if (!savedId && data.id) {
        setSavedId(data.id);
      }
      setIsPublished(publish);
      showToast(publish ? "Published!" : "Draft saved!");
    } catch (err) {
      console.error("Save error:", err);
      showToast("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!transcript.trim()) {
      showToast("Please paste a transcript first");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/learn/micro-lessons/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcript.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Generation failed");
        return;
      }

      setKeyPointsHtml(data.key_points_html);
      showToast("Key points generated!");
    } catch (err) {
      console.error("Generate error:", err);
      showToast("Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSendEmail() {
    if (!savedId) {
      showToast("Please save the lesson first");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/learn/micro-lessons/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: savedId }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Send failed");
        return;
      }

      setSentAt(new Date().toISOString());
      showToast(`Email sent to ${data.sent} user${data.sent !== 1 ? "s" : ""}!`);
    } catch (err) {
      console.error("Send error:", err);
      showToast("Send failed");
    } finally {
      setSending(false);
      setShowSendModal(false);
    }
  }

  function handleCopyEmailHtml() {
    if (!savedId) {
      showToast("Please save the lesson first");
      return;
    }
    const html = buildStandaloneEmailHtml({
      title,
      key_points_html: keyPointsHtml,
      video_url: videoUrl,
      id: savedId,
    });
    navigator.clipboard.writeText(html).then(() => {
      showToast("Email HTML copied to clipboard!");
    });
  }

  if (!canAccess) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <p className="text-gray-500 text-sm">You do not have permission to access this page.</p>
        </div>
      </AppShell>
    );
  }

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => router.push("/learn/admin/micro-learning")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#304256] mb-2 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Admin
              </button>
              <h1 className="text-xl font-bold text-[#304256]">
                {isNew ? "Create Micro-Lesson" : "Edit Micro-Lesson"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isPublished && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 rounded-full">Published</span>
              )}
              {sentAt && (
                <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-full">
                  Sent {new Date(sentAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
              <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How to Handle VIP Guest Requests"
                className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c]"
              />
            </div>

            {/* Description */}
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
              <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this lesson covers..."
                rows={3}
                className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c] resize-none"
              />
            </div>

            {/* Video URL */}
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
              <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider mb-2">Google Drive Video URL *</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/XXXXX/view?usp=drive_link"
                className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c]"
              />
              <p className="text-[11px] text-gray-400 mt-1">Paste a Google Drive sharing link. It will be auto-converted for embedding.</p>
            </div>

            {/* Tags */}
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
              <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider mb-2">Tags</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., Sales, Customer Service, VIP"
                className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c]"
              />
              <p className="text-[11px] text-gray-400 mt-1">Separate tags with commas</p>
              {parseTags().length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {parseTags().map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 text-[11px] font-medium rounded-full" style={{ backgroundColor: "#e0f7f3", color: "#27a28c" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Transcript */}
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider">Transcript</label>
                <button
                  onClick={handleGenerate}
                  disabled={generating || !transcript.trim()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {generating ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
                      </svg>
                      Generate Key Points
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste the video transcript here..."
                rows={10}
                className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c] resize-y font-mono text-xs leading-relaxed"
              />
            </div>

            {/* Key Points HTML */}
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
              <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider mb-2">Key Points HTML</label>
              {keyPointsHtml && (
                <div className="mb-4 p-4 border border-[#E8ECF1] rounded-lg bg-gray-50">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview</p>
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: keyPointsHtml }} />
                </div>
              )}
              <textarea
                value={keyPointsHtml}
                onChange={(e) => setKeyPointsHtml(e.target.value)}
                placeholder="HTML key points content (generated or manually edited)..."
                rows={8}
                className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c] resize-y font-mono text-xs"
              />
            </div>

            {/* Brand + Thumbnail row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Brand */}
              <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
                <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider mb-2">Brand</label>
                {userIsAdmin ? (
                  <select
                    value={lessonBrand}
                    onChange={(e) => setLessonBrand(e.target.value)}
                    className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c]"
                  >
                    <option value="tc">Travel Collection (all users)</option>
                    {BRAND_NAMES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-[#304256]">{lessonBrand === "tc" ? "Travel Collection" : lessonBrand}</p>
                )}
              </div>

              {/* Thumbnail */}
              <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
                <label className="block text-xs font-semibold text-[#304256] uppercase tracking-wider mb-2">Thumbnail URL</label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c]"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-semibold text-[#304256] border border-[#E8ECF1] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Draft"}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Publish to Atlas"}
                </button>
                <button
                  onClick={() => setShowSendModal(true)}
                  disabled={!savedId || sending}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-[#304256] rounded-lg hover:bg-[#304256]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send to All Users
                </button>
                <button
                  onClick={handleCopyEmailHtml}
                  disabled={!savedId}
                  className="px-5 py-2.5 text-sm font-semibold text-[#304256] border border-[#E8ECF1] rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Email HTML
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Send confirmation modal */}
        {showSendModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-base font-semibold text-[#304256] mb-2">Send Email</h3>
              <p className="text-sm text-gray-500 mb-4">
                This will send the micro-lesson email to {lessonBrand === "tc" ? "all" : lessonBrand} users. Are you sure?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-500 border border-[#E8ECF1] rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={sending}
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#304256] rounded-lg hover:bg-[#304256]/90 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Yes, Send"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#304256] text-white text-sm px-4 py-2.5 rounded-lg shadow-lg animate-fade-in">
            {toast}
          </div>
        )}
      </div>
    </AppShell>
  );
}
