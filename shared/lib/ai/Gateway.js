import { GroqProvider } from "./providers/GroqProvider";
import { GeminiProvider } from "./providers/GeminiProvider";
import { validateAndSanitizePrompt } from "./PromptGuard";
import { trackCost } from "./CostTracker";
import { cacheManager } from "@/shared/lib/cache/CacheManager";
import { logger } from "@/shared/lib/logger";

const providers = {
  groq: new GroqProvider(),
  gemini: new GeminiProvider(),
};

/**
 * AI Gateway
 * Single entry point for all LLM calls across the application.
 * Features:
 * - Prompt injection detection & sanitization
 * - In-memory response caching (if cacheKey provided)
 * - Automatic exponential backoff retry on transient errors
 * - Automatic provider fallback (e.g. Groq → Gemini on rate limit or outage)
 * - Token count & cost estimation log
 */
export async function executeAIGateway({
  prompt,
  provider = "groq",
  model = null,
  temperature = 0.3,
  maxTokens = 4000,
  jsonMode = false,
  cacheKey = null,
  cacheTtl = 3600,
  userId = "anonymous",
  retries = 2,
}) {
  // 1. Sanitize input prompt
  const safePrompt = validateAndSanitizePrompt(prompt);

  // 2. Check cache
  if (cacheKey) {
    const cached = cacheManager.get(`ai:${cacheKey}`);
    if (cached) {
      logger.debug("AI Gateway cache hit", { cacheKey });
      return cached;
    }
  }

  const selectedProvider = providers[provider] || providers.groq;
  const targetModel = model || (provider === "gemini" ? "models/gemini-flash-latest" : "llama-3.3-70b-versatile");

  let lastError = null;

  // 3. Retry loop with fallback
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      logger.debug(`AI Gateway execution attempt ${attempt}`, { provider, model: targetModel });
      const result = await selectedProvider.generate(safePrompt, {
        model: targetModel,
        temperature,
        maxTokens,
        jsonMode,
      });

      // 4. Track usage & cost
      trackCost({
        provider: selectedProvider.name,
        model: targetModel,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        userId,
      });

      // 5. Store in cache
      if (cacheKey && result.text) {
        cacheManager.set(`ai:${cacheKey}`, result.text, cacheTtl);
      }

      return result.text;
    } catch (error) {
      lastError = error;
      logger.warn(`AI Gateway attempt ${attempt} failed`, { provider: selectedProvider.name, error: error.message });

      // If rate limited or service unavailable, try fallback provider on final attempt
      if (attempt === retries && provider === "groq" && providers.gemini) {
        logger.warn("Falling back from Groq to Gemini due to repeated failure");
        try {
          const fallbackResult = await providers.gemini.generate(safePrompt, {
            model: "models/gemini-flash-latest",
            temperature,
            maxTokens,
            jsonMode,
          });
          return fallbackResult.text;
        } catch (fallbackErr) {
          logger.error("AI Gateway fallback also failed", { error: fallbackErr.message });
        }
      }

      // Backoff sleep before retry
      if (attempt <= retries) {
        await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 500));
      }
    }
  }

  throw new Error(`AI Gateway failed after ${retries + 1} attempts: ${lastError?.message}`);
}
