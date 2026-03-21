"use client";

import { useState, useEffect } from "react";

interface EnrollmentRow {
  id: string;
  user_email: string;
  user_name: string | null;
  status: "enrolled" | "in_progress" | "completed";
  enrolled_at: string;
  due_date: string | null;
  completed_at: string | null;
  progress_pct: number;
}

interface EnrollmentManagerProps {
  courseId: string;
}

export default function EnrollmentManager({ courseId }: EnrollmentManagerProps) {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDueDate, setEditDueDate] = useState<string | null>(null);
  const [dueDateDraft, setDueDateDraft] = useState("");

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
      // Endpoint may not exist yet -- show placeholder
    } finally {
      setLoading(false);
    }
  };

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
            <tr className="text-left text-[11px] uppercase tracking-wide text-gray-400 border-b border-[#E8ECF1]">
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Enrolled</th>
              <th className="px-4 py-2.5 font-medium">Due Date</th>
              <th className="px-4 py-2.5 font-medium">Progress</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enr) => (
              <tr
                key={enr.id}
                className="border-b border-[#E8ECF1] last:border-b-0 hover:bg-gray-50/50"
              >
                <td className="px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-[#304256]">
                      {enr.user_name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">{enr.user_email}</p>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                      statusColors[enr.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusLabels[enr.status] || enr.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-500">
                  {new Date(enr.enrolled_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5">
                  {editDueDate === enr.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="date"
                        value={dueDateDraft}
                        onChange={(e) => setDueDateDraft(e.target.value)}
                        className="px-2 py-1 text-xs border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                      />
                      <button
                        onClick={() => {
                          // Would PATCH enrollment due_date here
                          setEditDueDate(null);
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
                <td className="px-4 py-2.5">
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
                <td className="px-4 py-2.5">
                  {enr.status !== "completed" && (
                    <button
                      onClick={() => {
                        // Would PATCH enrollment status to completed here
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
