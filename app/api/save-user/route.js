import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError } from "@/shared/lib/utils/apiError";
import { logger } from "@/shared/lib/logger";

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) {
    throw new UnauthorizedError("Must be signed in to save profile");
  }

  const { clerkId, name, email } = await req.json();

  if (clerkId && clerkId !== userId) {
    throw new UnauthorizedError("Cannot save profile for a different user");
  }

  try {
    await connectDB();
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({ clerkId: userId, name, email });
      logger.info("User saved", { email, userId });
    } else {
      logger.debug("User already exists", { email, userId });
    }

    return successResponse({ message: "User stored successfully", user });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      logger.warn("MongoDB offline/paused during save-user. Using mock response.", { error: err.message });
      return successResponse({
        message: "User stored locally (mock mode)",
        user: { clerkId: userId, name: name || "Developer", email: email || "dev@local" },
      });
    }
    throw err;
  }
});
