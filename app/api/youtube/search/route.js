import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/shared/lib/logger";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(userId, RATE_LIMITS.LIGHT);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query missing" }, { status: 400 });
    }

    const YT_KEY = process.env.YOUTUBE_API_KEY;
    if (!YT_KEY) {
      logger.warn("YOUTUBE_API_KEY is not configured");
      return NextResponse.json([]);
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&videoDuration=short&videoEmbeddable=true&q=${encodeURIComponent(
      query
    )}&key=${YT_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items) {
      return NextResponse.json([]);
    }

    const videos = data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle,
    }));

    return NextResponse.json(videos);
  } catch (err) {
    logger.error("GET /api/youtube/search error", { error: err.message });
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
