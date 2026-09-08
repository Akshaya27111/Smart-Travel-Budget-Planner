import { NextRequest, NextResponse } from "next/server";
import { generateSavingsRecommendations } from "@/lib/ai-assistant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { params, breakdown } = body;

    if (!params || !breakdown) {
      return NextResponse.json(
        { error: "Missing required trip parameters or breakdown" },
        { status: 400 }
      );
    }

    // Generate explainable recommendations
    const recommendations = generateSavingsRecommendations(params, breakdown);

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate savings recommendations" },
      { status: 500 }
    );
  }
}
