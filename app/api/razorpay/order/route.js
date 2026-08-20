import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/shared/lib/logger";
import { rateLimit, RATE_LIMITS } from "@/shared/lib/middleware/rateLimit";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(userId, RATE_LIMITS.LIGHT);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { amount, currency = "INR" } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0 || amount > 100000) {
      return NextResponse.json({ error: "Invalid amount specified" }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency,
      receipt: `receipt_order_${Math.random().toString(36).substring(7)}`,
      notes: {
        userId,
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    logger.error("Razorpay order creation failed:", { error: error.message });
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
