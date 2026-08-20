import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import CourseUI from "./CourseUI";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs/server";

export default async function CoursePage({ params }) {
  // ✅ params is async in modern Next.js
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return <h1>Invalid course ID</h1>;
  }

  const { userId } = await auth();
  await connectDB();

  const course = await Course.findOne({ _id: id, userId }).lean();

  if (!course) {
    return <h1>Course not found</h1>;
  }

  // ✅ REQUIRED for Client Component
  const safeCourse = JSON.parse(JSON.stringify(course));

  return <CourseUI course={safeCourse} />;
}
