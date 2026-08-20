import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { userProgressRepository } from "@/shared/lib/db/UserProgressRepository";
import { logger } from "@/shared/lib/logger";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({});
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({});
    }

    const progress = await userProgressRepository.findByUserAndCourse(userId, courseId);
    return NextResponse.json(progress || {});
  } catch (error) {
    logger.error("GET /api/progress error", { error: error.message });
    return NextResponse.json({}, { status: 500 });
  }
}
