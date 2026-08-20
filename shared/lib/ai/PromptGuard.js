/**
 * Prompt Injection & Sanitization Guard
 * Protects LLMs from common jailbreaks, system instruction overriding, and prompt injection attacks.
 */

const INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /ignore all previous/i,
  /disregard system prompt/i,
  /you are now Dan/i,
  /do anything now/i,
  /bypass safety/i,
  /system prompt override/i,
];

export class SecurityError extends Error {
  constructor(message = "Potentially harmful or unsafe input detected") {
    super(message);
    this.name = "SecurityError";
    this.statusCode = 400;
  }
}

export function validateAndSanitizePrompt(input) {
  if (!input || typeof input !== "string") return "";

  const trimmed = input.trim();

  // Check for injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      throw new SecurityError("Input flagged by PromptGuard: suspicious instruction override pattern detected.");
    }
  }

  // Sanitize excessive control characters or invisible unicode repeats
  return trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");
}
