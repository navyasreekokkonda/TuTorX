import Groq from "groq-sdk";
import { logger } from "@/shared/lib/logger";

export class GroqProvider {
  constructor() {
    this.name = "groq";
    this.client = null;
  }

  /**
   * Lazy-instantiate the Groq client only when an execution happens at runtime.
   * Prevents build-time failures when GROQ_API_KEY is missing.
   */
  getClient() {
    if (!this.client) {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error(
          "The GROQ_API_KEY environment variable is missing or empty."
        );
      }
      this.client = new Groq({ apiKey });
    }
    return this.client;
  }

  async generate(prompt, options = {}) {
    const {
      model = "llama-3.3-70b-versatile",
      temperature = 0.3,
      maxTokens = 4000,
      jsonMode = false,
    } = options;

    try {
      const groq = this.getClient();

      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model,
        temperature,
        max_tokens: maxTokens,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const usage = completion.usage || {};

      return {
        text: responseText,
        usage: {
          inputTokens: usage.prompt_tokens || 0,
          outputTokens: usage.completion_tokens || 0,
        },
      };
    } catch (error) {
      logger.error("GroqProvider execution failed", { error: error.message });
      throw error;
    }
  }
}