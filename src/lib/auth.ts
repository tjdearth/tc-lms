import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Gmail scope is requested separately via /api/auth/gmail-scope
// Only @travelcollection.co users get the Gmail compose permission

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the Google access token and refresh token on first sign-in
      if (account) {
        console.log("Auth JWT: new sign-in, scopes:", account.scope);
        console.log("Auth JWT: access_token present?", !!account.access_token, "refresh_token present?", !!account.refresh_token);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0;
      }
      // Return previous token if still valid
      if (Date.now() < (token.accessTokenExpires as number || 0)) {
        return token;
      }
      // Refresh the token if expired
      if (token.refreshToken) {
        try {
          const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string,
            }),
          });
          const data = await res.json();
          if (data.access_token) {
            token.accessToken = data.access_token;
            token.accessTokenExpires = Date.now() + (data.expires_in || 3600) * 1000;
          }
        } catch (err) {
          console.error("Token refresh error:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      // Pass access token to session for server-side Gmail API calls
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
