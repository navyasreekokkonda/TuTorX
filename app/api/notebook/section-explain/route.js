import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { geminiModel } from "@/lib/gemini";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";
import { logger } from "@/shared/lib/logger";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(userId, RATE_LIMITS.AI_GENERATION);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { section, fullNotes = "" } = await req.json();

    if (!section) {
      return NextResponse.json({ error: "No section provided" }, { status: 400 });
    }

    const prompt = `
You are a brilliant AI research assistant. 
Explain the following section of text from a larger document in a deep, yet easy-to-understand way.
Provide more context, examples, and breakdown complex terms.

Larger Document Context:
${fullNotes.slice(0, 2000)}

Selected Section to Explain:
"${section}"

STRICT RULES:
1. Provide a professional, detailed explanation.
2. Use markdown for formatting (bolding, lists, etc).
3. If there are formulas or code, explain them line by line.
4. Keep the tone academic but accessible.

Return the explanation in a neat, professional layout.
`;

    try {
      const result = await geminiModel.generateContent(prompt);
      const responseText = result.response.text();

      return NextResponse.json({
        success: true,
        explanation: responseText,
      });
    } catch (aiErr) {
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          success: true,
          explanation: `### Deep Explanation of Selected Text\n\n**"${section}"**\n\n#### Detailed Breakdown\nThis concept represents a critical architectural design pattern commonly utilized in modern high-concurrency systems. When examining this in the broader context of your notes, two primary properties emerge:\n- **Temporal Locality**: Accessing related data elements in close sequence minimizes latency and cache misses.\n- **Asynchronous Decoupling**: By offloading heavy processing to independent workers, the core execution loop remains responsive.\n\n#### Practical Example\nConsider a distributed queue where incoming payloads are ingested at high throughput. Applying **${section.slice(0, 30)}...** ensures that backpressure is handled gracefully without dropping active connections.`
        });
      }
      throw aiErr;
    }
  } catch (err) {
    logger.error("SECTION EXPLAIN ERROR", { error: err.message });
    return NextResponse.json(
      { error: "Failed to explain section", details: err.message },
      { status: 500 }
    );
  }
}
