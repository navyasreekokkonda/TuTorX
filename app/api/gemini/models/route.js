import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "@/shared/lib/logger";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(userId, RATE_LIMITS.LIGHT);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: true, models: [] });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = await genAI.listModels();

    // Return only useful info
    const filtered = models.models.map((m) => ({
      name: m.name,
      displayName: m.displayName,
      description: m.description,
      supportedMethods: m.supportedGenerationMethods,
    }));

    return NextResponse.json({
      success: true,
      models: filtered,
    });
  } catch (err) {
    logger.error("MODEL LIST ERROR:", { error: err.message });
    return NextResponse.json(
      { error: "Failed to list models", details: err.message },
      { status: 500 }
    );
  }
}
