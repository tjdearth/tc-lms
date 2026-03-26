import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isCourseCreator } from "@/lib/admin";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isCourseCreator(session.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Micro-lesson id is required" }, { status: 400 });
    }

    // Fetch the micro-lesson
    const { data: lesson, error: lessonErr } = await supabaseAdmin
      .from("micro_lessons")
      .select("*")
      .eq("id", id)
      .single();

    if (lessonErr || !lesson) {
      return NextResponse.json({ error: "Micro-lesson not found" }, { status: 404 });
    }

    // Fetch users — filter by brand if not 'tc'
    let usersQuery = supabaseAdmin.from("lms_users").select("id, email, name");
    if (lesson.brand && lesson.brand !== "tc") {
      usersQuery = usersQuery.eq("brand", lesson.brand);
    }

    const { data: users, error: usersErr } = await usersQuery;
    if (usersErr) {
      return NextResponse.json({ error: usersErr.message }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ sent: 0, message: "No users found" });
    }

    const fromEmail = process.env.DIGEST_FROM_EMAIL || "noreply@travelcollection.co";
    const baseUrl = process.env.NEXTAUTH_URL || "https://atlas.travelcollection.co";

    // Convert Google Drive URL to direct link for the button
    const videoUrl = lesson.video_url;

    const html = buildEmailHtml({
      title: lesson.title,
      keyPointsHtml: lesson.key_points_html || "",
      videoUrl,
      lessonId: lesson.id,
      baseUrl,
    });

    let sentCount = 0;
    const resend = getResend();

    for (const user of users) {
      try {
        await resend.emails.send({
          from: fromEmail,
          to: user.email,
          subject: `New Micro-Lesson: ${lesson.title}`,
          html,
        });
        sentCount++;
      } catch {
        console.error(`Failed to send micro-lesson email to ${user.email}`);
      }
    }

    // Update sent_at
    await supabaseAdmin
      .from("micro_lessons")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", id);

    return NextResponse.json({ sent: sentCount });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildEmailHtml({
  title,
  keyPointsHtml,
  videoUrl,
  lessonId,
  baseUrl,
}: {
  title: string;
  keyPointsHtml: string;
  videoUrl: string;
  lessonId: string;
  baseUrl: string;
}): string {
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
        <h2 style="margin:0;color:#304256;font-size:22px;font-weight:700;">${title}</h2>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 24px;">
        ${keyPointsHtml}
      </td>
    </tr>
    <tr>
      <td style="padding:0 32px 24px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding-right:12px;">
              <a href="${videoUrl}" style="display:inline-block;padding:12px 24px;background:#27a28c;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">&#9654; Watch the Full Video</a>
            </td>
            <td>
              <a href="${baseUrl}/learn/micro-learning/${lessonId}" style="display:inline-block;padding:12px 24px;background:#304256;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">View in Atlas</a>
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
