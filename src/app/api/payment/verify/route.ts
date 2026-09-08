import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentId, signature, isSandbox } = body;

    // Sandbox handling for academic evaluation
    if (isSandbox) {
      if (!paymentId || !orderId) {
        return NextResponse.json(
          { success: false, error: "Invalid sandbox payment payload" },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        verified: true,
        isSandbox: true,
        paymentReference: paymentId,
        message: "Demo sandbox payment verified successfully.",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "RAZORPAY_KEY_SECRET is not configured on the server.",
        },
        { status: 500 }
      );
    }

    // HMAC SHA256 verification
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentReference: paymentId,
      message: "Payment verified successfully. Subscription activated.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
