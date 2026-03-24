// Admin email addresses — only these users can access /wiki/admin and the wiki API
// Add emails here as needed
export const ADMIN_EMAILS: string[] = [
  "tucker@travelcollection.co",
  "tdearth@travelcollection.com",
  "giulia@travelcollection.co",
  // Add more admin emails here
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export const COURSE_CREATOR_EMAILS: string[] = [
  // Add course-only creators here (admins are automatically course creators)
];

export function isCourseCreator(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  return ADMIN_EMAILS.includes(e) || COURSE_CREATOR_EMAILS.includes(e);
}
