import { auth } from "@clerk/nextjs/server";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError, ValidationError } from "@/shared/lib/utils/apiError";
import { notebookRepository } from "@/shared/lib/db/NotebookRepository";

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const data = await req.json();
  if (!data || !data.title) {
    throw new ValidationError("Notebook title is required");
  }

  const notebook = await notebookRepository.create({
    ...data,
    userId, // enforce authenticated user ownership
  });

  return successResponse({ notebook }, {}, 201);
});
