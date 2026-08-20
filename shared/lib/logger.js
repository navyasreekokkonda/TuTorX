/**
 * Structured Logger
 *
 * Replaces all console.log() with structured JSON logging.
 * Supports request IDs, correlation IDs, and log levels.
 * Future-ready for Sentry, OpenTelemetry, Prometheus.
 *
 * Usage:
 *   import { logger } from "@/shared/lib/logger";
 *   logger.info("User created", { userId: "123", email: "a@b.com" });
 *   logger.error("DB connection failed", { error: err.message });
 */

import { randomUUID } from "crypto";

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || "info"] ?? LOG_LEVELS.info;

function formatLog(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  // In production, output JSON for log aggregators
  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(entry);
  }

  // In development, output readable format
  const color = {
    debug: "\x1b[36m",  // cyan
    info: "\x1b[32m",   // green
    warn: "\x1b[33m",   // yellow
    error: "\x1b[31m",  // red
  }[level] || "\x1b[0m";

  const reset = "\x1b[0m";
  const metaStr = Object.keys(meta).length > 0
    ? ` ${JSON.stringify(meta)}`
    : "";

  return `${color}[${level.toUpperCase()}]${reset} ${entry.timestamp} — ${message}${metaStr}`;
}

function log(level, message, meta = {}) {
  if (LOG_LEVELS[level] < CURRENT_LEVEL) return;

  const formatted = formatLog(level, message, meta);

  switch (level) {
    case "error":
      console.error(formatted);
      break;
    case "warn":
      console.warn(formatted);
      break;
    default:
      console.log(formatted);
  }
}

export const logger = {
  debug: (message, meta) => log("debug", message, meta),
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
};

/**
 * Generate a unique request ID for tracing.
 * Attach to every API request for correlation.
 */
export function generateRequestId() {
  return randomUUID();
}

/**
 * Create a child logger with a pre-set context (e.g., requestId, userId).
 *
 * Usage:
 *   const reqLogger = createContextLogger({ requestId: "abc-123", userId: "user_1" });
 *   reqLogger.info("Processing request");
 */
export function createContextLogger(context = {}) {
  return {
    debug: (message, meta) => logger.debug(message, { ...context, ...meta }),
    info: (message, meta) => logger.info(message, { ...context, ...meta }),
    warn: (message, meta) => logger.warn(message, { ...context, ...meta }),
    error: (message, meta) => logger.error(message, { ...context, ...meta }),
  };
}
