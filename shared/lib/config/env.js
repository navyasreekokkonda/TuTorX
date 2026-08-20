/**
 * Centralized environment configuration.
 * Validates all required env vars at startup — fail fast if anything is missing.
 *
 * Usage:
 *   import { env } from "@/shared/lib/config/env";
 *   const uri = env.MONGODB_URI;
 */

function requireEnv(key, isPublic = false) {
  const value = process.env[key];
  if (!value) {
    // In build time, some server env vars may not be available — only warn for client vars
    if (typeof window !== "undefined" && !isPublic) return undefined;
    if (process.env.NODE_ENV === "production") {
      throw new Error(`[ENV] Missing required environment variable: ${key}`);
    }
    console.warn(`[ENV] Warning: Missing environment variable: ${key}`);
    return undefined;
  }
  return value;
}

/** Server-only environment variables — NEVER expose to client */
export const env = {
  // Database
  MONGODB_URI: requireEnv("MONGODB_URI"),

  // Auth (server secret)
  CLERK_SECRET_KEY: requireEnv("CLERK_SECRET_KEY"),

  // AI Providers
  GROQ_API_KEY: requireEnv("GROQ_API_KEY"),
  GEMINI_API_KEY: requireEnv("GEMINI_API_KEY"),

  // External APIs
  YOUTUBE_API_KEY: requireEnv("YOUTUBE_API_KEY"),
  JUDGE0_API_KEY: requireEnv("JUDGE0_API_KEY"),
  JUDGE0_URL: requireEnv("JUDGE0_URL") || "https://judge0-ce.p.rapidapi.com",
  JUDGE0_HOST: process.env.JUDGE0_HOST || "judge0-ce.p.rapidapi.com",

  // Payments
  RAZORPAY_KEY_SECRET: requireEnv("RAZORPAY_KEY_SECRET"),
};

/** Client-safe environment variables (NEXT_PUBLIC_ prefix) */
export const clientEnv = {
  CLERK_PUBLISHABLE_KEY: requireEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", true),
  RAZORPAY_KEY_ID: requireEnv("NEXT_PUBLIC_RAZORPAY_KEY_ID", true),
};
