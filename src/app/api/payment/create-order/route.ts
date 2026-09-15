import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const body = await req.json();
    const { plan, allowDemoSandbox } = body;
    // ₹1 Trial for 30 days in paise, with ₹99/month recurring autopay
    const amountInPaise = 100; 

    // Check if live Razorpay credentials are configured
    if (!keyId || !keySecret) {
      if (allowDemoSandbox) {
        // Explicitly flagged test sandbox order for evaluation without fake live payment
        return NextResponse.json({
          success: true,
          isSandbox: true,
          orderId: `order_demo_${Date.now()}`,
          amount: amountInPaise,
          currency: "INR",
          keyId: "rzp_test_demo_placeholder",
          note: "Demo sandbox mode: 30-day trial for ₹1 (renews at ₹99/mo autopay) enabled for university project demonstration.",
        });
      }

      return NextResponse.json(
        {
          success: false,
          requiresCredentials: true,
          missingVars: ["NEXT_PUBLIC_RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"],
          message:
            "Razorpay credentials are not yet configured in environment variables. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable live payments.",
        },
        { status: 400 }
      );
    }

    // Live Razorpay API call
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          plan: plan || "premium",
        },
      }),
    });

    const orderData = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: orderData.error?.description || "Order creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      isSandbox: false,
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
