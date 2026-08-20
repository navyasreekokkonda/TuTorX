import { QueueInterface } from "./QueueInterface";
import { logger } from "@/shared/lib/logger";

/**
 * SynchronousQueue
 * Vercel Serverless compatible implementation of QueueInterface.
 * Executes registered handlers synchronously within the request lifecycle,
 * eliminating the need for external daemons (BullMQ/Redis) during default Vercel deployment.
 * 
 * To migrate to external background workers on Railway/Render:
 * Create BullMQQueue class extending QueueInterface and swap the exported instance.
 */
export class SynchronousQueue extends QueueInterface {
  constructor() {
    super();
    this.handlers = new Map();
    this.jobs = new Map();
  }

  async registerHandler(queueName, handler) {
    this.handlers.set(queueName, handler);
    logger.info(`[SynchronousQueue] Registered handler for queue: ${queueName}`);
  }

  async enqueue(queueName, payload, options = {}) {
    const jobId = `sync_job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const handler = this.handlers.get(queueName);

    if (!handler) {
      logger.warn(`[SynchronousQueue] No handler registered for queue "${queueName}". Job ${jobId} marked pending.`);
      this.jobs.set(jobId, { jobId, status: "pending", payload });
      return { jobId, status: "pending" };
    }

    this.jobs.set(jobId, { jobId, status: "active", payload });

    try {
      const result = await handler(jobId, payload);
      this.jobs.set(jobId, { jobId, status: "completed", result });
      return { jobId, status: "completed", result };
    } catch (error) {
      logger.error(`[SynchronousQueue] Job ${jobId} failed in queue "${queueName}"`, { error: error.message });
      this.jobs.set(jobId, { jobId, status: "failed", error: error.message });
      return { jobId, status: "failed", error: error.message };
    }
  }

  async getStatus(jobId) {
    return this.jobs.get(jobId) || { jobId, status: "unknown" };
  }
}

export const defaultQueue = new SynchronousQueue();
