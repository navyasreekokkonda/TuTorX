import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { userProgressRepository } from "@/shared/lib/db/UserProgressRepository";
import { courseRepository } from "@/shared/lib/db/CourseRepository";
import { logger } from "@/shared/lib/logger";

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterIndex, topicIndex } = await req.json();

    const progress = await userProgressRepository.findOrInitialize(userId, courseId);

    const exists = progress.completedTopics.some(
      (t) => t.chapterIndex === chapterIndex && t.topicIndex === topicIndex
    );

    if (!exists) {
      progress.completedTopics.push({ chapterIndex, topicIndex });
    }

    progress.lastViewed = { chapterIndex, topicIndex };

    const course = await courseRepository.findById(courseId);
    if (course && course.chapters) {
      const totalTopics = course.chapters.reduce(
        (sum, ch) => sum + (ch.topics ? ch.topics.length : 0),
        0
      );

      progress.progressPercent = totalTopics
        ? Math.round((progress.completedTopics.length / totalTopics) * 100)
        : 0;
    }

    await progress.save();

    return NextResponse.json({
      success: true,
      progressPercent: progress.progressPercent,
    });
  } catch (error) {
    logger.error("POST /api/progress/topic error", { error: error.message });
    return NextResponse.json({ error: "Failed to update topic progress" }, { status: 500 });
  }
}
