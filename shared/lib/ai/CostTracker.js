import { logger } from "@/shared/lib/logger";

/**
 * Token Cost Estimation and Tracking
 * Standard pricing table per 1M tokens (approximate reference rates in USD).
 */
const PRICING_PER_1M_TOKENS = {
  "llama-3.3-70b-versatile": { input: 0.59, output: 0.79 },
  "models/gemini-flash-latest": { input: 0.075, output: 0.30 },
  "models/gemini-pro": { input: 1.25, output: 5.00 },
};

/**
 * Approximate token count estimation (roughly 4 characters per token for English text).
 */
export function estimateTokens(text = "") {
  if (!text || typeof text !== "string") return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Track usage and calculate estimated cost.
 */
export function trackCost({ provider, model, inputTokens, outputTokens, userId = "anonymous" }) {
  const rates = PRICING_PER_1M_TOKENS[model] || { input: 0.50, output: 0.50 };
  const inputCost = (inputTokens / 1_000_000) * rates.input;
  const outputCost = (outputTokens / 1_000_000) * rates.output;
  const totalCost = inputCost + outputCost;

  logger.info("AI Token Usage & Cost", {
    userId,
    provider,
    model,
    inputTokens,
    outputTokens,
    estimatedCostUsd: Number(totalCost.toFixed(6)),
  });

  return totalCost;
}
