import { auth } from "@clerk/nextjs/server";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError, ValidationError, RateLimitError, AppError } from "@/shared/lib/utils/apiError";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";
import { generateProblems, getSessions } from "@/controllers/aiController";

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const rl = rateLimit(userId, RATE_LIMITS.AI_GENERATION);
  if (!rl.allowed) throw new RateLimitError();

  let { pattern, count, difficulty } = await req.json();
  if (!pattern || !count || !difficulty) {
    throw new ValidationError("Missing required fields: pattern, count, difficulty");
  }

  /* =========================
     CHECK FREE TIER QUOTA (MAX 2 CODING QUESTIONS)
  ========================= */
  try {
    const existingSessions = await getSessions(userId);
    const totalProblems = (existingSessions || []).reduce(
      (sum, s) => sum + (Array.isArray(s.problems) ? s.problems.length : 0),
      0
    );

    if (totalProblems >= 2 && userId !== "demo_user_123") {
      throw new AppError("Free tier limit reached! Free users can generate up to 2 coding practice questions. Please upgrade to Pro or try our Guest Sandbox.", 403, "QUOTA_EXCEEDED");
    }

    // Ensure free users cannot request > 2 problems in one go
    if (count > 2 && userId !== "demo_user_123") {
      count = 2;
    }
  } catch (err) {
    if (err.statusCode === 403) throw err;
  }

  const session = await generateProblems(userId, pattern, count, difficulty);

  return successResponse({ problems: session.problems, session });
});
