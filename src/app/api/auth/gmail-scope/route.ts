import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET — redirect TC users to Google OAuth with Gmail scope
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email?.endsWith("@travelcollection.co")) {
    return NextResponse.json({ error: "Gmail drafts only available for TC users" }, { status: 403 });
  }

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
    response_type: "code",
    scope: "openid email profile https://www.googleapis.com/auth/gmail.compose",
    access_type: "offline",
    prompt: "consent",
    state: Buffer.from(JSON.stringify({ callbackUrl: "/learn/admin/micro-learning" })).toString("base64url"),
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
