import { auth } from "@clerk/nextjs/server";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError, ValidationError, NotFoundError } from "@/shared/lib/utils/apiError";
import { goalRepository } from "@/shared/lib/db/GoalRepository";

export const GET = apiHandler(async () => {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const result = await goalRepository.findByUserId(userId, { limit: 100 });
  return successResponse(result.items, { pagination: result.pagination });
});

export const POST = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const { text } = await req.json();
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new ValidationError("Goal text is required");
  }

  const goal = await goalRepository.create({
    text: text.trim(),
    userId,
    completed: false,
  });

  return successResponse(goal, {}, 201);
});

export const PATCH = apiHandler(async (req) => {
  const { userId } = await auth();
  if (!userId) throw new UnauthorizedError();

  const { id } = await req.json();
  if (!id) throw new ValidationError("Goal ID is required");

  const existing = await goalRepository.findOne({ _id: id, userId });
  if (!existing) throw new NotFoundError("Goal not found or access denied");

  const updated = await goalRepository.updateById(id, {
    completed: !existing.completed,
  });

  return successResponse(updated);
});
