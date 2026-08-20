import { auth } from "@clerk/nextjs/server";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError } from "@/shared/lib/utils/apiError";
import { notebookRepository } from "@/shared/lib/db/NotebookRepository";

export const GET = apiHandler(async () => {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const result = await notebookRepository.findByUserId(userId, { limit: 100 });
  return successResponse(result.items, { pagination: result.pagination });
});
