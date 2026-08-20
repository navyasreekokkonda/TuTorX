import { GoogleGenerativeAI } from "@google/generative-ai";
import { BaseProvider } from "./BaseProvider";
import { estimateTokens } from "../CostTracker";

export class GeminiProvider extends BaseProvider {
  constructor() {
    super("gemini");
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generate(prompt, options = {}) {
    const modelName = options.model || "models/gemini-flash-latest";
    const model = this.genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.3,
        maxOutputTokens: options.maxTokens ?? 4000,
        ...(options.jsonMode && { responseMimeType: "application/json" }),
      },
    });

    const text = result.response.text();
    const inputTokens = estimateTokens(prompt);
    const outputTokens = estimateTokens(text);

    return {
      text,
      usage: { inputTokens, outputTokens },
    };
  }
}
