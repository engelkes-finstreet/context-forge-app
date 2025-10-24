import { createAuthClient } from "better-auth/react";

// Dynamically determine the base URL for client-side auth
const getClientBaseURL = () => {
  // If NEXT_PUBLIC_BETTER_AUTH_URL is explicitly set, use it
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  // On Vercel, use NEXT_PUBLIC_VERCEL_URL (set automatically by Vercel)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // In browser, we can use window.location.origin
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Fallback to localhost for local development
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
});

export const { signIn, signUp, signOut, useSession } = authClient;
