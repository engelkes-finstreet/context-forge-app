import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dynamically determine the base URL based on environment
const getBaseURL = () => {
  // If BETTER_AUTH_URL is explicitly set, use it
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  // On Vercel, use the deployment URL
  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`;
    return url;
  }

  // Fallback to localhost for local development
  return "http://localhost:3000";
};

const baseURL = getBaseURL();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true if you want to verify emails
  },
  secret: process.env.BETTER_AUTH_SECRET || "",
  baseURL,
  trustedOrigins: [baseURL],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (session token is refreshed if it's older than this)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
