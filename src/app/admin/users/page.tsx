"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { isAdmin } from "@/lib/admin";
import { BRAND_NAMES } from "@/lib/brands";

interface RoleEntry {
  role: string;
  brand: string | null;
  source: "system" | "database" | "hr";
  id?: string;
}

interface UserWithRoles {
  email: string;
  name: string | null;
  roles: RoleEntry[];
}

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin: { bg: "#304256", text: "#ffffff" },
  course_creator: { bg: "#27a28c", text: "#ffffff" },
  wiki_admin: { bg: "#7C3AED", text: "#ffffff" },
  gm: { bg: "#E8A838", text: "#1a1a1a" },
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  course_creator: "Course Creator",
  wiki_admin: "Wiki Admin",
  gm: "GM",
};

const SOURCE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  system: { bg: "#E8ECF1", text: "#6B7D8F", label: "System" },
  database: { bg: "#D1FAE5", text: "#065F46", label: "Database" },
  hr: { bg: "#FEF3C7", text: "#92400E", label: "HR" },
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add form state
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("course_creator");
  const [newBrand, setNewBrand] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Backfill state
  const [backfilling, setBackfilling] = useState(false);
  const [backfillResult, setBackfillResult] = useState<{
    inserted: number;
    already_present: number;
    hr_total: number;
    message?: string;
  } | null>(null);

  async function runBackfill() {
    if (!confirm("Seed lms_users from hr_users? Anyone in HR who isn't already in lms_users will be added so they receive micro-learning emails.")) {
      return;
    }
    setBackfilling(true);
    setBackfillResult(null);
    try {
      const res = await fetch("/api/admin/backfill-lms-users", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Backfill failed");
      setBackfillResult(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Backfill failed");
    } finally {
      setBackfilling(false);
    }
  }

  const userEmail = session?.user?.email || "";
  const hasAccess = status === "authenticated" && isAdmin(userEmail);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!hasAccess) {
      router.push("/");
      return;
    }
    fetchUsers();
  }, [status, hasAccess, router, fetchUsers]);

  const handleAdd = async () => {
    if (!newEmail.trim()) {
      setAddError("Email is required");
      return;
    }
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          role: newRole,
          brand: newBrand || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Failed to add role");
        return;
      }
      setNewEmail("");
      setNewRole("course_creator");
      setNewBrand("");
      await fetchUsers();
    } catch {
      setAddError("Network error");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this role?")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to remove role");
        return;
      }
      await fetchUsers();
    } catch {
      alert("Network error");
    }
  };

  // Stats
  const stats = {
    admins: new Set(users.filter((u) => u.roles.some((r) => r.role === "admin")).map((u) => u.email)).size,
    courseCreators: new Set(users.filter((u) => u.roles.some((r) => r.role === "course_creator")).map((u) => u.email)).size,
    wikiAdmins: new Set(users.filter((u) => u.roles.some((r) => r.role === "wiki_admin")).map((u) => u.email)).size,
    gms: new Set(users.filter((u) => u.roles.some((r) => r.role === "gm")).map((u) => u.email)).size,
  };

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#304256" }} />
        </div>
      </AppShell>
    );
  }

  if (!hasAccess) return null;

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#304256] mb-1">
            User Access Management
          </h1>
          <p className="text-gray-500">
            Manage admin, course creator, and wiki admin roles across Travel Collection and DMC brands.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Admins", value: stats.admins, color: "#304256" },
            { label: "Course Creators", value: stats.courseCreators, color: "#27a28c" },
            { label: "Wiki Admins", value: stats.wikiAdmins, color: "#7C3AED" },
            { label: "GMs", value: stats.gms, color: "#E8A838" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-[#E8ECF1] p-5"
            >
              <div className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Email Recipient Backfill */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] p-5 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[260px]">
              <h2 className="text-sm font-semibold mb-1" style={{ color: "#304256" }}>
                Email Recipient List
              </h2>
              <p className="text-xs text-gray-500">
                Micro-learning emails go to everyone in <code className="text-[11px] bg-gray-100 px-1 rounded">lms_users</code>. By default that only includes people who&apos;ve visited the Learn section. Run this to backfill from HR so the whole company is covered.
              </p>
            </div>
            <button
              onClick={runBackfill}
              disabled={backfilling}
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 flex-shrink-0"
              style={{ backgroundColor: "#27a28c" }}
            >
              {backfilling ? "Backfilling..." : "Backfill from HR"}
            </button>
          </div>
          {backfillResult && (
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: "#f0fdf9", border: "1px solid #d1fae5" }}>
              <div className="font-semibold mb-1" style={{ color: "#065F46" }}>
                {backfillResult.inserted > 0
                  ? `Added ${backfillResult.inserted} new recipient${backfillResult.inserted !== 1 ? "s" : ""}`
                  : "No backfill needed"}
              </div>
              <div style={{ color: "#374151" }}>
                {backfillResult.hr_total} HR users · {backfillResult.already_present} already present · {backfillResult.inserted} inserted
                {backfillResult.message ? ` — ${backfillResult.message}` : ""}
              </div>
            </div>
          )}
        </div>

        {/* Add User Section */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] p-5 mb-8">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#304256" }}>
            Add Role
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="user@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E8ECF1", color: "#304256" }}
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E8ECF1", color: "#304256" }}
            >
              <option value="admin">Admin</option>
              <option value="course_creator">Course Creator</option>
              <option value="wiki_admin">Wiki Admin</option>
            </select>
            <select
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none"
              style={{ border: "1px solid #E8ECF1", color: "#304256" }}
            >
              <option value="">Global (TC)</option>
              {BRAND_NAMES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity"
              style={{
                backgroundColor: "#304256",
                color: "#fff",
                opacity: adding ? 0.6 : 1,
              }}
            >
              {adding ? "Adding..." : "Add"}
            </button>
          </div>
          {addError && (
            <p className="text-xs mt-2" style={{ color: "#DC2626" }}>
              {addError}
            </p>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div
            className="rounded-xl p-4 mb-6 text-sm"
            style={{ backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
          >
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Brand</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Source</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) =>
                  user.roles.map((role, ri) => (
                    <tr
                      key={`${user.email}-${role.role}-${role.brand}-${role.source}-${ri}`}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50"
                    >
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">
                        {ri === 0 ? (user.name || "-") : ""}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-400">
                        {ri === 0 ? user.email : ""}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: ROLE_COLORS[role.role]?.bg || "#E8ECF1",
                            color: ROLE_COLORS[role.role]?.text || "#304256",
                          }}
                        >
                          {ROLE_LABELS[role.role] || role.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {role.brand || "Global"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: SOURCE_STYLES[role.source]?.bg || "#E8ECF1",
                            color: SOURCE_STYLES[role.source]?.text || "#6B7D8F",
                          }}
                        >
                          {SOURCE_STYLES[role.source]?.label || role.source}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {role.source === "database" && role.id ? (
                          <button
                            onClick={() => handleRemove(role.id!)}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        ) : role.source === "system" ? (
                          <span className="text-xs text-gray-400">Hardcoded</span>
                        ) : role.source === "hr" ? (
                          <span className="text-xs text-gray-400">HR Hub</span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                      No elevated users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
