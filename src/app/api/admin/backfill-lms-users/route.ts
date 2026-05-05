import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { brandFromEmail } from "@/lib/brands";

// POST — admin-only one-shot to seed lms_users with everyone from hr_users.
// Safe to re-run: skips emails that already exist in lms_users.
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Pull every employee from HR
  const { data: hr, error: hrErr } = await supabaseAdmin
    .from("hr_users")
    .select("email, first_name, last_name, dmc");

  if (hrErr) {
    return NextResponse.json({ error: hrErr.message }, { status: 500 });
  }
  const hrUsers = (hr || []).filter((u) => u.email);

  // Find which of those already exist in lms_users
  const emails = hrUsers.map((u) => u.email.toLowerCase());
  const { data: existing } = await supabaseAdmin
    .from("lms_users")
    .select("email")
    .in("email", emails);

  const existingSet = new Set((existing || []).map((u) => u.email.toLowerCase()));

  // Build inserts for the missing ones
  const toInsert = hrUsers
    .filter((u) => !existingSet.has(u.email.toLowerCase()))
    .map((u) => {
      const email = u.email.toLowerCase();
      const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || null;
      // Prefer the HR-assigned DMC; fall back to email-domain mapping
      const brand = u.dmc || brandFromEmail(email);
      return {
        email,
        name: fullName,
        image_url: null,
        brand,
      };
    });

  if (toInsert.length === 0) {
    return NextResponse.json({
      hr_total: hrUsers.length,
      already_present: existingSet.size,
      inserted: 0,
      message: "Nothing to backfill — every HR user already has an lms_users row.",
    });
  }

  const { error: insertErr } = await supabaseAdmin
    .from("lms_users")
    .insert(toInsert);

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({
    hr_total: hrUsers.length,
    already_present: existingSet.size,
    inserted: toInsert.length,
    inserted_emails: toInsert.map((u) => u.email),
  });
}
