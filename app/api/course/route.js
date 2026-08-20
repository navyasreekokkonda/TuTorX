// app/api/course/route.js
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/shared/lib/logger";
import { courseRepository } from "@/shared/lib/db/CourseRepository";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const result = await courseRepository.findByUserId(userId, { limit: 100 });
    const courses = result.items || [];

    const enrichedCourses = courses.map((course) => {
      const totalTopics = Array.isArray(course.chapters)
        ? course.chapters.reduce(
            (sum, ch) =>
              sum + (Array.isArray(ch?.topics) ? ch.topics.length : 0),
            0
          )
        : 0;

      const { chapters, ...rest } = course;

      return {
        ...rest,
        totalTopics,
      };
    });

    return NextResponse.json(enrichedCourses, { status: 200 });
  } catch (error) {
    logger.error("GET /api/course error", { error: error.message });
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
