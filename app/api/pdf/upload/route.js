import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { logger } from "@/shared/lib/logger";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";

export const runtime = "nodejs";

// ✅ Correct worker path (STRING, not default import)
const workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.mjs",
  import.meta.url
).toString();

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(userId, RATE_LIMITS.HEAVY);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
    }

    // 1️⃣ Read form data
    const formData = await req.formData();
    const file = formData.get("pdf");

    if (!file) {
      return NextResponse.json({ error: "No PDF uploaded" }, { status: 400 });
    }

    // Security: Validate file size (max 10MB to prevent Vercel memory exhaustion)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF file too large (max 10MB allowed)" }, { status: 413 });
    }

    // 2️⃣ Convert file → Uint8Array (RAM only)
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 3️⃣ Explicit worker setup (FIX)
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

    // 4️⃣ Load PDF
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
    });

    const pdf = await loadingTask.promise;

    let extractedText = "";

    // 5️⃣ Extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item) => item.str)
        .filter(Boolean)
        .join(" ");

      extractedText += pageText + "\n\n";
    }

    return NextResponse.json({
      success: true,
      pages: pdf.numPages,
      text: extractedText,
    });
  } catch (err) {
    logger.error("PDF ERROR:", { error: err.message });
    return NextResponse.json(
      {
        error: "PDF processing failed",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
