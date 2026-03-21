// Admin email addresses — only these users can access /wiki/admin and the wiki API
// Add emails here as needed
export const ADMIN_EMAILS: string[] = [
  "tucker@travelcollection.com",
  "tdearth@travelcollection.com",
  // Add more admin emails here
];

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
