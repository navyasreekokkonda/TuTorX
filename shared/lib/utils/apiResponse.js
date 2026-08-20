import { NextResponse } from "next/server";

/**
 * Standardized API Response Builder.
 * Ensures consistent response format across all endpoints:
 * { success: boolean, data?: any, error?: string, meta?: object }
 */

export function successResponse(data = null, meta = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(Object.keys(meta).length > 0 && { meta }),
    },
    { status }
  );
}

export function errorResponse(message = "An unexpected error occurred", status = 500, code = null) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(code && { code }),
    },
    { status }
  );
}
