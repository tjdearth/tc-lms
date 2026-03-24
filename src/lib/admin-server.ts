import { ADMIN_EMAILS, COURSE_CREATOR_EMAILS } from "./admin";
import { supabaseAdmin } from "./supabase-admin";

/**
 * Check if a user is a wiki admin for a specific brand.
 * Returns true if the user is a global admin OR is a GM for the given brand.
 */
export async function isWikiAdminForBrand(email: string, brand: string): Promise<boolean> {
  const e = email.toLowerCase();
  if (ADMIN_EMAILS.includes(e)) return true;

  const { data } = await supabaseAdmin
    .from("hr_users")
    .select("id")
    .eq("email", e)
    .eq("hr_role", "gm")
    .eq("dmc", brand)
    .limit(1);

  return !!(data && data.length > 0);
}

/**
 * Check if a user can create/edit courses for a specific brand.
 * Returns true if the user is a global admin, global course creator, or GM for the given brand.
 */
export async function isCourseCreatorForBrand(email: string, brand: string): Promise<boolean> {
  const e = email.toLowerCase();
  if (ADMIN_EMAILS.includes(e) || COURSE_CREATOR_EMAILS.includes(e)) return true;

  const { data } = await supabaseAdmin
    .from("hr_users")
    .select("id")
    .eq("email", e)
    .eq("hr_role", "gm")
    .eq("dmc", brand)
    .limit(1);

  return !!(data && data.length > 0);
}

/**
 * Get the brand a user is GM for, or null if they are not a GM.
 */
export async function getGmBrand(email: string): Promise<string | null> {
  const e = email.toLowerCase();
  const { data } = await supabaseAdmin
    .from("hr_users")
    .select("dmc")
    .eq("email", e)
    .eq("hr_role", "gm")
    .limit(1);

  if (data && data.length > 0) {
    return data[0].dmc as string;
  }
  return null;
}
