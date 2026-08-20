import { GeminiProvider } from "./providers/GeminiProvider";
import { logger } from "../logger";

const geminiProvider = new GeminiProvider();

/**
 * AI Gateway router that defaults strictly to Gemini.
 * Eliminates top-level Groq initialization to prevent build-time failures.
 */
export async function executeAIGateway({
  prompt,
  provider = "gemini",
  model = "models/gemini-flash-latest",
  temperature = 0.3,
  maxTokens = 6000,
  jsonMode = false,
}) {
  try {
    // Standardize provider to Gemini
    return await geminiProvider.generate({
      prompt,
      model,
      temperature,
      maxTokens,
      jsonMode,
    });
  } catch (error) {
    logger.error("AI Gateway Execution Error:", {
      provider,
      error: error.message,
    });
    throw error;
  }
}