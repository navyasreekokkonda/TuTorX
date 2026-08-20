import { auth } from "@clerk/nextjs/server";
import { executeAIGateway } from "@/shared/lib/ai/Gateway";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import {
  UnauthorizedError,
  ValidationError,
} from "@/shared/lib/utils/apiError";

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  const { text, targetLanguage } = await req.json();

  if (!text || !targetLanguage) {
    throw new ValidationError("Missing text or target language");
  }

  const prompt = `Translate the following text accurately into ${targetLanguage}. Return ONLY the translated text with no extra commentary or formatting:\n\n${text}`;

  const translatedText = await executeAIGateway({
    prompt,
    provider: "gemini",
    temperature: 0.1,
    userId,
  });

  return successResponse({ translatedText: translatedText.trim() });
});