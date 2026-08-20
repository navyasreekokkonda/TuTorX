import mongoose from "mongoose";
import { logger } from "@/shared/lib/logger";

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    const err = new Error("Please define the MONGODB_URI environment variable inside .env.local");
    logger.error(err.message);
    throw err;
  }

  if (!cached.promise) {
    const opts = {
      dbName: "ai_learning_platform",
      bufferCommands: false, // Fail fast if DB connection drops, preventing 10s query buffering timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      logger.info("MongoDB Connected Successfully");
      return mongooseInstance;
    }).catch((error) => {
      cached.promise = null; // Clear cached promise on failure so next request retries cleanly
      logger.error("MongoDB Connection Error", { error: error.message });
      throw error; // Re-throw so route handlers catch immediately instead of buffering queries for 10s
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
};
