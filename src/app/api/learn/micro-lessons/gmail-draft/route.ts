import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isCourseCreator } from "@/lib/admin";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = (session as any).accessToken as string | undefined;
    console.log("Gmail draft: accessToken present?", !!accessToken, "email:", session.user.email);
    if (!accessToken) {
      return NextResponse.json(
        { error: "Gmail access not available. Please sign out and sign back in to grant email permissions." },
        { status: 401 }
      );
    }

    const { subject, html } = await req.json();
    if (!subject || !html) {
      return NextResponse.json({ error: "Subject and HTML are required" }, { status: 400 });
    }

    // RFC 2047 encode the subject for UTF-8 (emojis, special chars)
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`;

    // Build the raw RFC 2822 email message
    const rawMessage = [
      `From: ${session.user.email}`,
      `To: `,
      `Subject: ${encodedSubject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      Buffer.from(html, "utf-8").toString("base64"),
    ].join("\r\n");

    // Base64url encode the message (Gmail API requirement)
    const encoded = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Create draft via Gmail API
    const gmailRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: { raw: encoded },
      }),
    });

    if (!gmailRes.ok) {
      const errorData = await gmailRes.json().catch(() => ({}));
      console.error("Gmail API error:", gmailRes.status, errorData);

      if (gmailRes.status === 401 || gmailRes.status === 403) {
        return NextResponse.json(
          { error: "Gmail permission expired. Please sign out and sign back in." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create Gmail draft" },
        { status: 500 }
      );
    }

    const draft = await gmailRes.json();

    return NextResponse.json({
      draftId: draft.id,
      messageId: draft.message?.id,
    });
  } catch (e: unknown) {
    console.error("Gmail draft error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
