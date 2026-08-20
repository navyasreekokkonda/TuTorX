import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay environment variables missing" },
        { status: 500 }
      );
    }

    // Instantiated strictly inside POST handler to prevent build-time evaluation errors
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const body = await req.json();
    const { amount, currency = "INR", receipt } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}