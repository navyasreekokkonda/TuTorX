import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";

/**
 * GET /api/health
 *
 * Liveness + readiness probe.
 * Returns system status, uptime, and dependency health.
 */
export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "0.1.0",
    dependencies: {},
  };

  // Check MongoDB
  try {
    await connectDB();
    const dbState = mongoose.connection.readyState;
    health.dependencies.mongodb = {
      status: dbState === 1 ? "connected" : "disconnected",
      readyState: dbState,
    };
  } catch (error) {
    health.dependencies.mongodb = {
      status: "error",
      message: error.message,
    };
    health.status = "degraded";
  }

  // Check AI providers (key existence only — don't make API calls)
  health.dependencies.groq = {
    status: process.env.GROQ_API_KEY ? "configured" : "missing",
  };
  health.dependencies.gemini = {
    status: process.env.GEMINI_API_KEY ? "configured" : "missing",
  };
  health.dependencies.judge0 = {
    status: process.env.JUDGE0_API_KEY ? "configured" : "missing",
  };

  const statusCode = health.status === "ok" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
