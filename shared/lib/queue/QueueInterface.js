/**
 * QueueInterface
 * Abstract base class defining standard background task processing operations.
 * Allows decoupling business logic from background job infrastructure (BullMQ, RabbitMQ, SQS, etc.).
 */
export class QueueInterface {
  /**
   * Enqueues a job for processing.
   * @param {string} queueName - Name of the target queue.
   * @param {Object} payload - Data payload for the job.
   * @param {Object} [options] - Optional job settings (attempts, delay, priority).
   * @returns {Promise<{ jobId: string, status: string }>}
   */
  async enqueue(queueName, payload, options = {}) {
    throw new Error("QueueInterface.enqueue() must be implemented by concrete subclass");
  }

  /**
   * Registers a processor/handler function for a specific queue.
   * @param {string} queueName - Name of the target queue.
   * @param {Function} handler - Async function taking (jobId, payload).
   */
  async registerHandler(queueName, handler) {
    throw new Error("QueueInterface.registerHandler() must be implemented by concrete subclass");
  }

  /**
   * Retrieves the current status of a job.
   * @param {string} jobId - Unique identifier of the job.
   * @returns {Promise<{ jobId: string, status: 'pending'|'active'|'completed'|'failed', result?: any, error?: string }>}
   */
  async getStatus(jobId) {
    throw new Error("QueueInterface.getStatus() must be implemented by concrete subclass");
  }
}
