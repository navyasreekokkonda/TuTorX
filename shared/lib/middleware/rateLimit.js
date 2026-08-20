/**
 * In-Memory Rate Limiter
 *
 * Limits requests per user/IP using a sliding window.
 * Future-ready for Redis-backed rate limiting.
 *
 * Usage:
 *   import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";
 *
 *   // In API route:
 *   const limiterResult = rateLimit(identifier, RATE_LIMITS.AI_GENERATION);
 *   if (!limiterResult.allowed) {
 *     return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
 *   }
 */

/** @type {Map<string, { count: number, resetTime: number }>} */
const store = new Map();

// Clean up expired entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) {
        store.delete(key);
      }
    }
  }, 60_000);
}

/**
 * Pre-defined rate limits for different endpoint categories.
 */
export const RATE_LIMITS = {
  /** AI generation endpoints (expensive) — 10 requests per minute */
  AI_GENERATION: { maxRequests: 10, windowMs: 60_000 },

  /** Standard API endpoints — 60 requests per minute */
  STANDARD: { maxRequests: 60, windowMs: 60_000 },

  /** Auth endpoints — 20 requests per minute */
  AUTH: { maxRequests: 20, windowMs: 60_000 },

  /** Heavy operations (PDF upload, code execution) — 5 per minute */
  HEAVY: { maxRequests: 5, windowMs: 60_000 },
};

/**
 * Check if a request is within rate limits.
 *
 * @param {string} identifier - Unique key (userId, IP, or combination)
 * @param {{ maxRequests: number, windowMs: number }} limit - Rate limit config
 * @returns {{ allowed: boolean, remaining: number, resetIn: number }}
 */
export function rateLimit(identifier, limit = RATE_LIMITS.STANDARD) {
  const now = Date.now();
  const key = `rl:${identifier}`;

  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    // First request or window expired — reset
    store.set(key, { count: 1, resetTime: now + limit.windowMs });
    return {
      allowed: true,
      remaining: limit.maxRequests - 1,
      resetIn: limit.windowMs,
    };
  }

  if (entry.count >= limit.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}
