"use client";

import { useState, useEffect, useMemo } from "react";

const DMC_COLORS: Record<string, string> = {
  "Authenticus Italy": "#C6B356",
  "Unbox Spain & Portugal": "#7C1137",
  "Truly Swahili": "#4F9E2D",
  "Across Mexico": "#E56456",
  "Kembali Indonesia": "#ADA263",
  "Majlis Retreats": "#B28A72",
  "Crown Journey": "#6D7581",
  "Oshinobi Travel": "#E9395E",
  "Essentially French": "#58392E",
  "Elura Australia": "#B04D32",
  "Nira Thailand": "#636218",
  "Sar Turkiye": "#247F82",
  "Nostos Greece": "#0E1952",
  "Vista Colombia": "#FEE9A8",
  "Awaken Peru": "#95AFA2",
  "Experience Morocco": "#F56A23",
  "Travel Collection": "#304256",
  "Travel Collection HQ": "#304256",
};

function brandTextColor(bg: string): string {
  const hex = bg.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#304256" : "#ffffff";
}

interface EnrollmentRow {
  id: string;
  user_email: string;
  user_name: string | null;
  user_brand: string | null;
  status: "enrolled" | "in_progress" | "completed";
  enrolled_at: string;
  due_date: string | null;
  completed_at: string | null;
  progress_pct: number;
  quiz_best_score: number | null;
  quiz_attempts: number;
  quiz_passed: number;
}

type SortKey = "user_name" | "user_brand" | "status" | "enrolled_at" | "due_date" | "progress_pct" | "quiz_best_score";
type SortDir = "asc" | "desc";

interface EnrollmentManagerProps {
  courseId: string;
}

export default function EnrollmentManager({ courseId }: EnrollmentManagerProps) {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDueDate, setEditDueDate] = useState<string | null>(null);
  const [dueDateDraft, setDueDateDraft] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("enrolled_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetchEnrollments();
  }, [courseId]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/learn/admin/enrollments?course_id=${courseId}`
      );
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    const arr = [...enrollments];
    const statusOrder: Record<string, number> = { enrolled: 0, in_progress: 1, completed: 2 };
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "user_name":
          cmp = (a.user_name || "").localeCompare(b.user_name || "");
          break;
        case "user_brand":
          cmp = (a.user_brand || "").localeCompare(b.user_brand || "");
          break;
        case "status":
          cmp = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
          break;
        case "enrolled_at":
          cmp = (a.enrolled_at || "").localeCompare(b.enrolled_at || "");
          break;
        case "due_date":
          cmp = (a.due_date || "9999").localeCompare(b.due_date || "9999");
          break;
        case "progress_pct":
          cmp = a.progress_pct - b.progress_pct;
          break;
        case "quiz_best_score":
          cmp = (a.quiz_best_score ?? -1) - (b.quiz_best_score ?? -1);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [enrollments, sortKey, sortDir]);

  const statusColors: Record<string, string> = {
    enrolled: "bg-blue-50 text-blue-600",
    in_progress: "bg-amber-50 text-amber-600",
    completed: "bg-[#27a28c]/10 text-[#27a28c]",
  };

  const statusLabels: Record<string, string> = {
    enrolled: "Enrolled",
    in_progress: "In Progress",
    completed: "Completed",
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block ml-1 transition-transform ${
        sortKey === col
          ? sortDir === "desc"
            ? "rotate-180 text-[#27a28c]"
            : "text-[#27a28c]"
          : "text-gray-300"
      }`}
    >
      <polyline points="6 9 12 4 18 9" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-8 text-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#E8ECF1"
          strokeWidth="1.5"
          className="mx-auto mb-3"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p className="text-sm text-gray-500">No enrollments yet</p>
        <p className="text-xs text-gray-400 mt-1">
          Users will appear here after they enrol in this course
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm overflow-hidden">
      {/* Summary */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50 border-b border-[#E8ECF1]">
        <span className="text-sm text-[#304256]">
          <span className="font-semibold">{enrollments.length}</span> enrolled
        </span>
        <span className="text-sm text-[#27a28c]">
          <span className="font-semibold">
            {enrollments.filter((e) => e.status === "completed").length}
          </span>{" "}
          completed
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wide text-gray-400 border-b border-[#E8ECF1]">
              <th
                className="px-2.5 py-2 font-medium cursor-pointer select-none hover:text-[#304256]"
                onClick={() => handleSort("user_name")}
              >
                User <SortIcon col="user_name" />
              </th>
              <th
                className="px-2.5 py-2 font-medium cursor-pointer select-none hover:text-[#304256]"
                onClick={() => handleSort("user_brand")}
              >
                DMC <SortIcon col="user_brand" />
              </th>
              <th
                className="px-2.5 py-2 font-medium cursor-pointer select-none hover:text-[#304256]"
                onClick={() => handleSort("status")}
              >
                Status <SortIcon col="status" />
              </th>
              <th
                className="px-2.5 py-2 font-medium cursor-pointer select-none hover:text-[#304256]"
                onClick={() => handleSort("enrolled_at")}
              >
                Enrolled <SortIcon col="enrolled_at" />
              </th>
              <th
                className="px-2.5 py-2 font-medium cursor-pointer select-none hover:text-[#304256]"
                onClick={() => handleSort("due_date")}
              >
                Due Date <SortIcon col="due_date" />
              </th>
              <th
                className="px-2.5 py-2 font-medium cursor-pointer select-none hover:text-[#304256]"
                onClick={() => handleSort("progress_pct")}
              >
                Progress <SortIcon col="progress_pct" />
              </th>
              <th
                className="px-2.5 py-2 font-medium cursor-pointer select-none hover:text-[#304256]"
                onClick={() => handleSort("quiz_best_score")}
              >
                Quiz Score <SortIcon col="quiz_best_score" />
              </th>
              <th className="px-2.5 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((enr) => (
              <tr
                key={enr.id}
                className="border-b border-[#E8ECF1] last:border-b-0 hover:bg-gray-50/50"
              >
                <td className="px-2.5 py-1.5">
                  <div>
                    <p className="text-xs font-medium text-[#304256]">
                      {enr.user_name || "Unknown"}
                    </p>
                    <p className="text-[10px] text-gray-400">{enr.user_email}</p>
                  </div>
                </td>
                <td className="px-2.5 py-1.5">
                  {enr.user_brand ? (
                    <span
                      className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: DMC_COLORS[enr.user_brand] || "#304256",
                        color: brandTextColor(DMC_COLORS[enr.user_brand] || "#304256"),
                      }}
                    >
                      {enr.user_brand}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-2.5 py-1.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                      statusColors[enr.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusLabels[enr.status] || enr.status}
                  </span>
                </td>
                <td className="px-2.5 py-1.5 text-xs text-gray-500">
                  {new Date(enr.enrolled_at).toLocaleDateString()}
                </td>
                <td className="px-2.5 py-1.5">
                  {editDueDate === enr.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={dueDateDraft}
                        onChange={(e) => setDueDateDraft(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                      />
                      <button
                        onClick={async () => {
                          await fetch("/api/learn/admin/enrollments", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: enr.id, due_date: dueDateDraft || null }),
                          });
                          setEditDueDate(null);
                          fetchEnrollments();
                        }}
                        className="text-[#27a28c] text-xs font-medium"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditDueDate(enr.id);
                        setDueDateDraft(enr.due_date || "");
                      }}
                      className="text-xs text-gray-500 hover:text-[#27a28c] transition-colors"
                    >
                      {enr.due_date
                        ? new Date(enr.due_date).toLocaleDateString()
                        : "Set date"}
                    </button>
                  )}
                </td>
                <td className="px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#E8ECF1] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#27a28c] rounded-full"
                        style={{ width: `${enr.progress_pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {enr.progress_pct}%
                    </span>
                  </div>
                </td>
                <td className="px-2.5 py-1.5">
                  {enr.quiz_best_score !== null ? (
                    <div>
                      <span className={`text-xs font-medium ${enr.quiz_best_score >= 70 ? "text-[#27a28c]" : "text-amber-600"}`}>
                        {enr.quiz_best_score}%
                      </span>
                      <span className="text-[10px] text-gray-400 ml-1">
                        ({enr.quiz_attempts} attempt{enr.quiz_attempts !== 1 ? "s" : ""})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-2.5 py-1.5">
                  {enr.status !== "completed" && (
                    <button
                      onClick={async () => {
                        await fetch("/api/learn/admin/enrollments", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: enr.id, status: "completed" }),
                        });
                        fetchEnrollments();
                      }}
                      className="text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
