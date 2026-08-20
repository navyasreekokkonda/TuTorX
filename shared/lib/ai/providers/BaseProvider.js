/**
 * Base AI Provider Interface
 * All model providers (Groq, Gemini, OpenAI, Anthropic) must extend this class.
 */
export class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * @param {string} prompt - Sanitized user prompt
   * @param {object} options - Options { model, temperature, maxTokens, jsonMode }
   * @returns {Promise<{ text: string, usage: { inputTokens: number, outputTokens: number } }>}
   */
  async generate(prompt, options = {}) {
    throw new Error(`generate() must be implemented by provider ${this.name}`);
  }
}
