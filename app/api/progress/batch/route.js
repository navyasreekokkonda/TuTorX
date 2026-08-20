import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { userProgressRepository } from "@/shared/lib/db/UserProgressRepository";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError } from "@/shared/lib/utils/apiError";

export const GET = apiHandler(async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new UnauthorizedError("You must be signed in to view batch progress");
  }

  const allProgress = await userProgressRepository.bulkFindByUser(userId);

  // Map progress by courseId string for O(1) frontend lookup
  const progressMap = {};
  for (const item of allProgress) {
    const courseIdStr = item.courseId?.toString() || item.courseId;
    progressMap[courseIdStr] = item;
  }

  return successResponse(progressMap);
});
