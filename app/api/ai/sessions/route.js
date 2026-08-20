import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSessions, getSession } from "@/controllers/aiController";
import { logger } from "@/shared/lib/logger";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("id");

    if (sessionId) {
      const session = await getSession(sessionId);
      if (!session || session.userId !== userId) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      return NextResponse.json(session, { status: 200 });
    }

    const sessions = await getSessions(userId);
    return NextResponse.json(sessions, { status: 200 });
  } catch (error) {
    logger.error("API Error (sessions)", { error: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
