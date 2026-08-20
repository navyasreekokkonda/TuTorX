import Groq from "groq-sdk";
import { BaseProvider } from "./BaseProvider";
import { estimateTokens } from "../CostTracker";

export class GroqProvider extends BaseProvider {
  constructor() {
    super("groq");
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generate(prompt, options = {}) {
    const model = options.model || "llama-3.3-70b-versatile";
    const completion = await this.client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 4000,
      ...(options.jsonMode && { response_format: { type: "json_object" } }),
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    const inputTokens = completion.usage?.prompt_tokens ?? estimateTokens(prompt);
    const outputTokens = completion.usage?.completion_tokens ?? estimateTokens(text);

    return {
      text,
      usage: { inputTokens, outputTokens },
    };
  }
}
