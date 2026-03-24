import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// POST — send due-date reminders (called by cron)
export async function POST(req: NextRequest) {
  try {
    // Auth via CRON_SECRET
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fromEmail =
      process.env.DIGEST_FROM_EMAIL || "noreply@travelcollection.co";

    // Get enrollments with due dates that aren't completed
    const { data: enrollments, error: enrollErr } = await supabaseAdmin
      .from("enrollments")
      .select("id, user_id, course_id, due_date, status")
      .neq("status", "completed")
      .not("due_date", "is", null);

    if (enrollErr) {
      return NextResponse.json({ error: enrollErr.message }, { status: 500 });
    }

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ sent: 0, details: [] });
    }

    // Collect user IDs and course IDs for batch lookups
    const userIds = Array.from(new Set(enrollments.map((e) => e.user_id)));
    const courseIds = Array.from(new Set(enrollments.map((e) => e.course_id)));

    const { data: users } = await supabaseAdmin
      .from("lms_users")
      .select("id, email, name")
      .in("id", userIds);

    const { data: courses } = await supabaseAdmin
      .from("courses")
      .select("id, title")
      .in("id", courseIds);

    const userMap = new Map(
      (users || []).map((u: { id: string; email: string; name: string | null }) => [u.id, u])
    );
    const courseMap = new Map(
      (courses || []).map((c: { id: string; title: string }) => [c.id, c])
    );

    // Get existing reminders to avoid duplicates
    const enrollmentIds = enrollments.map((e) => e.id);
    const { data: existingReminders } = await supabaseAdmin
      .from("reminder_log")
      .select("enrollment_id, reminder_type")
      .in("enrollment_id", enrollmentIds);

    const sentSet = new Set(
      (existingReminders || []).map(
        (r: { enrollment_id: string; reminder_type: string }) =>
          `${r.enrollment_id}:${r.reminder_type}`
      )
    );

    const now = new Date();
    const sentDetails: { enrollment_id: string; reminder_type: string; email: string }[] = [];

    for (const enrollment of enrollments) {
      const user = userMap.get(enrollment.user_id);
      const course = courseMap.get(enrollment.course_id);

      if (!user || !course) continue;

      const dueDate = new Date(enrollment.due_date);
      const diffMs = dueDate.getTime() - now.getTime();
      const daysUntilDue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // Determine which reminders to send
      const remindersToSend: { type: string; subject: string; bodyText: string }[] = [];

      if (daysUntilDue <= 7 && daysUntilDue > 1) {
        remindersToSend.push({
          type: "7_day",
          subject: `Reminder: "${course.title}" is due in ${daysUntilDue} days`,
          bodyText: `Your course <strong>${course.title}</strong> is due in <strong>${daysUntilDue} days</strong> (${dueDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}).`,
        });
      }

      if (daysUntilDue === 1 || daysUntilDue === 0) {
        remindersToSend.push({
          type: "1_day",
          subject: `Due tomorrow: "${course.title}"`,
          bodyText: `Your course <strong>${course.title}</strong> is due <strong>tomorrow</strong> (${dueDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}).`,
        });
      }

      if (daysUntilDue < 0) {
        remindersToSend.push({
          type: "overdue",
          subject: `Overdue: "${course.title}"`,
          bodyText: `Your course <strong>${course.title}</strong> was due on <strong>${dueDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong> and is now overdue.`,
        });
      }

      for (const reminder of remindersToSend) {
        const key = `${enrollment.id}:${reminder.type}`;
        if (sentSet.has(key)) continue;

        const userName = user.name || user.email.split("@")[0];

        const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
    <tr>
      <td style="background:#304256;padding:24px 32px;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Atlas <span style="color:#27a28c;font-weight:400;">&mdash; Learn</span></h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 16px;color:#333;font-size:16px;">Hi ${userName},</p>
        <p style="margin:0 0 24px;color:#333;font-size:16px;">${reminder.bodyText}</p>
        <p style="margin:0 0 16px;color:#333;font-size:16px;">Please log in to Atlas to continue your progress.</p>
        <a href="${process.env.NEXTAUTH_URL || "https://atlas.travelcollection.co"}/learn"
           style="display:inline-block;padding:12px 24px;background:#27a28c;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">
          Go to Atlas
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px;background:#f4f5f7;color:#888;font-size:12px;text-align:center;">
        Travel Collection &mdash; Atlas
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

        try {
          await getResend().emails.send({
            from: fromEmail,
            to: user.email,
            subject: reminder.subject,
            html,
          });

          // Log the reminder
          await supabaseAdmin.from("reminder_log").insert({
            enrollment_id: enrollment.id,
            reminder_type: reminder.type,
          });

          sentDetails.push({
            enrollment_id: enrollment.id,
            reminder_type: reminder.type,
            email: user.email,
          });
        } catch {
          // Skip individual email failures but continue processing
          console.error(
            `Failed to send ${reminder.type} reminder to ${user.email}`
          );
        }
      }
    }

    return NextResponse.json({
      sent: sentDetails.length,
      details: sentDetails,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
