import { generateRequestId, createContextLogger } from "@/shared/lib/logger";
import { errorResponse } from "@/shared/lib/utils/apiResponse";
import { AppError } from "@/shared/lib/utils/apiError";

/**
 * Higher-Order Function for API Route Handlers.
 * Automatically injects request IDs, catches errors, logs execution time, and standardizes output format.
 *
 * Usage:
 *   export const POST = apiHandler(async (req, { params, logger }) => {
 *     const data = await req.json();
 *     return successResponse(data);
 *   });
 */
export function apiHandler(handler) {
  return async (req, context = {}) => {
    const requestId = req.headers.get("x-request-id") || generateRequestId();
    const logger = createContextLogger({ requestId, path: req.nextUrl?.pathname });
    const startTime = Date.now();

    try {
      logger.debug("Request started", { method: req.method });
      const response = await handler(req, { ...context, logger, requestId });
      const duration = Date.now() - startTime;
      logger.debug("Request completed", { durationMs: duration, status: response?.status });
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Request failed with exception", {
        durationMs: duration,
        error: error.message,
        stack: error.stack,
      });

      if (error instanceof AppError) {
        return errorResponse(error.message, error.statusCode, error.code);
      }

      return errorResponse("Internal Server Error", 500, "INTERNAL_ERROR");
    }
  };
}
