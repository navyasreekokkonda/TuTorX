import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { runCode, submitCode } from "@/controllers/aiController";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";
import { logger } from "@/shared/lib/logger";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(userId, RATE_LIMITS.HEAVY);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many code execution requests. Please try again later." }, { status: 429 });
    }

    const { sessionId, problemIndex, code, language, testCases, isSubmit, runnerLogic } = await req.json();

    if (!code || code.trim() === "" || !language || !testCases) {
      return NextResponse.json({ 
        success: false, 
        message: "Code cannot be empty" 
      }, { status: 400 });
    }

    logger.debug("EXECUTE_CODE TRIGGERED", { language, runnerLogic: !!runnerLogic });

    const results = await runCode(code, language, testCases, { runnerLogic });

    if (isSubmit && sessionId && problemIndex !== undefined) {
      await submitCode(userId, sessionId, problemIndex, code, language, results);
    }

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    logger.error("API Error (execute-code)", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
