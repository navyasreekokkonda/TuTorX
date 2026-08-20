import { auth } from "@clerk/nextjs/server";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError, ValidationError, RateLimitError, AppError } from "@/shared/lib/utils/apiError";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";
import { executeAIGateway } from "@/shared/lib/ai/Gateway";

export const runtime = "nodejs";

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const rl = rateLimit(userId, RATE_LIMITS.HEAVY);
  if (!rl.allowed) throw new RateLimitError();

  const { text } = await req.json();
  if (!text || text.length < 200) {
    throw new ValidationError("Text too short to analyze (minimum 200 characters)");
  }

  const prompt = `
You are an AI tutor.

From the following content:
1. Create short notes with headings
2. Explain concepts in very simple words
3. Create 2-4 flashcards (question & answer)
4. Give a concise summary

Return ONLY valid JSON in this format:
{
  "summary": "",
  "notes": "",
  "easyExplanation": "",
  "flashcards": [
    { "question": "", "answer": "" }
  ]
}

CONTENT:
${text}
`;

  const responseText = await executeAIGateway({
    prompt,
    provider: "gemini",
    model: "models/gemini-flash-latest",
    temperature: 0.3,
    maxTokens: 4000,
    jsonMode: true,
    userId,
  });

  let parsed;
  try {
    const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new AppError("Failed to parse AI structure from document", 500, "AI_PARSE_ERROR");
  }

  return successResponse(parsed);
});
