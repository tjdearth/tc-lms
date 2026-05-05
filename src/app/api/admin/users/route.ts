import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin, ADMIN_EMAILS, COURSE_CREATOR_EMAILS } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";

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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const usersMap = new Map<string, UserWithRoles>();

  function getOrCreate(email: string): UserWithRoles {
    const key = email.toLowerCase();
    if (!usersMap.has(key)) {
      usersMap.set(key, { email: key, name: null, roles: [] });
    }
    return usersMap.get(key)!;
  }

  // 1. Hardcoded admins
  for (const email of ADMIN_EMAILS) {
    const user = getOrCreate(email);
    user.roles.push({ role: "admin", brand: null, source: "system" });
  }

  // Hardcoded course creators
  for (const email of COURSE_CREATOR_EMAILS) {
    const user = getOrCreate(email);
    user.roles.push({ role: "course_creator", brand: null, source: "system" });
  }

  // 2. Database roles from atlas_roles
  const { data: dbRoles } = await supabaseAdmin
    .from("atlas_roles")
    .select("id, email, role, brand, granted_by, created_at")
    .order("created_at", { ascending: true });

  if (dbRoles) {
    for (const row of dbRoles) {
      const user = getOrCreate(row.email);
      user.roles.push({
        role: row.role,
        brand: row.brand,
        source: "database",
        id: row.id,
      });
    }
  }

  // 3. GMs from hr_users
  const { data: gms } = await supabaseAdmin
    .from("hr_users")
    .select("email, name, dmc")
    .eq("hr_role", "gm");

  if (gms) {
    for (const gm of gms) {
      const user = getOrCreate(gm.email);
      user.roles.push({ role: "gm", brand: gm.dmc, source: "hr" });
      if (!user.name && gm.name) {
        user.name = gm.name;
      }
    }
  }

  // Try to resolve names from lms_users
  const allEmails = Array.from(usersMap.keys());
  if (allEmails.length > 0) {
    const { data: lmsUsers } = await supabaseAdmin
      .from("lms_users")
      .select("email, name")
      .in("email", allEmails);

    if (lmsUsers) {
      for (const u of lmsUsers) {
        const user = usersMap.get(u.email.toLowerCase());
        if (user && !user.name && u.name) {
          user.name = u.name;
        }
      }
    }
  }

  const users = Array.from(usersMap.values()).sort((a, b) =>
    a.email.localeCompare(b.email)
  );

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { email, role, brand } = body as {
    email: string;
    role: string;
    brand?: string | null;
  };

  if (!email || !role) {
    return NextResponse.json({ error: "email and role are required" }, { status: 400 });
  }

  const validRoles = ["admin", "course_creator", "wiki_admin"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("atlas_roles")
    .insert({
      email: email.toLowerCase().trim(),
      role,
      brand: brand || null,
      granted_by: session.user.email,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "This role already exists for this user" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, role: data });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { id } = body as { id: string };

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("atlas_roles")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
