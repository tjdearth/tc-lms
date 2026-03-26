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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#304256" }}>
            User Access Management
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7D8F" }}>
            Manage admin, course creator, and wiki admin roles across Travel Collection and DMC brands.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Admins", value: stats.admins, color: "#304256" },
            { label: "Course Creators", value: stats.courseCreators, color: "#27a28c" },
            { label: "Wiki Admins", value: stats.wikiAdmins, color: "#7C3AED" },
            { label: "GMs", value: stats.gms, color: "#E8A838" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{ backgroundColor: "#fff", border: "1px solid #E8ECF1" }}
            >
              <div className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs font-medium mt-1" style={{ color: "#6B7D8F" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Add User Section */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: "#fff", border: "1px solid #E8ECF1" }}
        >
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
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#fff", border: "1px solid #E8ECF1" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7D8F" }}>
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7D8F" }}>
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7D8F" }}>
                    Role
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7D8F" }}>
                    Brand
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7D8F" }}>
                    Source
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#6B7D8F" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) =>
                  user.roles.map((role, ri) => (
                    <tr
                      key={`${user.email}-${role.role}-${role.brand}-${role.source}-${ri}`}
                      style={{ borderTop: "1px solid #E8ECF1" }}
                    >
                      <td className="px-4 py-3 text-sm" style={{ color: "#304256" }}>
                        {ri === 0 ? (user.name || "-") : ""}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "#6B7D8F" }}>
                        {ri === 0 ? user.email : ""}
                      </td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-sm" style={{ color: "#304256" }}>
                        {role.brand || "Global"}
                      </td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-right">
                        {role.source === "database" && role.id ? (
                          <button
                            onClick={() => handleRemove(role.id!)}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
                            style={{ color: "#DC2626", backgroundColor: "#FEF2F2" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#FEE2E2";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#FEF2F2";
                            }}
                          >
                            Remove
                          </button>
                        ) : role.source === "system" ? (
                          <span className="text-xs" style={{ color: "#9CA3AF" }}>
                            Hardcoded
                          </span>
                        ) : role.source === "hr" ? (
                          <span className="text-xs" style={{ color: "#9CA3AF" }}>
                            HR Hub
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "#6B7D8F" }}>
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
