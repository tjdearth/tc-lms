// Admin email addresses — only these users can access /wiki/admin and the wiki API
// Add emails here as needed
export const ADMIN_EMAILS: string[] = [
  "tucker@travelcollection.co",
  "giulia@travelcollection.co",
  "ihab@travelcollection.co",
  "hamza@travelcollection.co",
  "thami@travelcollection.co",
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const COURSE_CREATOR_EMAILS: string[] = [
  "milena@travelcollection.co",
];

export function isCourseCreator(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  return ADMIN_EMAILS.includes(e) || COURSE_CREATOR_EMAILS.includes(e);
}

/**
 * Check if a user has the admin role in the atlas_roles database table.
 * This is an async check that supplements the hardcoded ADMIN_EMAILS list.
 * Import supabaseAdmin dynamically to avoid circular deps in client code.
 */
export async function isAdminFromDb(email: string): Promise<boolean> {
  if (!email) return false;
  const e = email.toLowerCase();

  // Hardcoded admins are always admin
  if (ADMIN_EMAILS.includes(e)) return true;

  // Dynamic import to keep this file importable from client (sync functions still work)
  const { supabaseAdmin } = await import("./supabase-admin");
  const { data } = await supabaseAdmin
    .from("atlas_roles")
    .select("id")
    .eq("email", e)
    .eq("role", "admin")
    .is("brand", null)
    .limit(1);

  return !!(data && data.length > 0);
}
