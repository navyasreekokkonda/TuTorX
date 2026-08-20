import { courseRepository } from "@/shared/lib/db/CourseRepository";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { logger } from "@/shared/lib/logger";

export async function PATCH(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, chapterIndex } = await req.json();

    const course = await courseRepository.findById(courseId);
    if (!course) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ success: true, mock: true });
      }
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.userId && course.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized access to course" }, { status: 403 });
    }

    if (course.chapters && course.chapters[chapterIndex]) {
      const updatedChapters = [...course.chapters];
      updatedChapters[chapterIndex] = { ...updatedChapters[chapterIndex], completed: true };
      await courseRepository.updateById(courseId, { chapters: updatedChapters });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("PATCH /api/course/complete-chapter error", { error: err.message });
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ success: true, mock: true });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
