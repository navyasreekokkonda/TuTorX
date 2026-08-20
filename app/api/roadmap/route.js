import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Roadmap from "@/models/Roadmap";
import { apiHandler } from "@/shared/lib/utils/apiHandler";
import { successResponse } from "@/shared/lib/utils/apiResponse";
import { UnauthorizedError } from "@/shared/lib/utils/apiError";

export const GET = apiHandler(async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new UnauthorizedError();
  }

  try {
    await connectDB();
    const roadmap = await Roadmap.find().sort({ order: 1 }).lean();
    return successResponse(roadmap);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      return successResponse([
        { _id: "step_1", title: "Data Structures & Algorithms", description: "Master core structures like Arrays, Trees, Graphs, and DP.", order: 1, status: "in-progress" },
        { _id: "step_2", title: "System Design Essentials", description: "Learn scalability, caching, queues, and database sharding.", order: 2, status: "upcoming" },
        { _id: "step_3", title: "AI/ML Engineering Architecture", description: "Understand LLMs, RAG pipelines, vector DBs, and model evaluation.", order: 3, status: "upcoming" }
      ]);
    }
    throw err;
  }
});
