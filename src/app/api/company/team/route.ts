import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("hr_users")
      .select("name, email, dmc, avatar_url, hr_role")
      .order("name");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group by DMC brand
    const byBrand: Record<string, {
      gm: { name: string; email: string; avatar_url: string | null } | null;
      team: { name: string; email: string; avatar_url: string | null }[];
    }> = {};

    for (const u of data || []) {
      const b = u.dmc || "Travel Collection";
      if (!byBrand[b]) byBrand[b] = { gm: null, team: [] };

      const member = {
        name: u.name || u.email.split("@")[0],
        email: u.email,
        avatar_url: u.avatar_url,
      };

      if (u.hr_role === "gm") {
        byBrand[b].gm = member;
      } else {
        byBrand[b].team.push(member);
      }
    }

    return NextResponse.json(byBrand);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
