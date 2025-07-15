import { getCurrentUser } from "@/actions/onboarding";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "PATIENT") {
      return NextResponse.json(
        { success: false, error: "Only patients have credit balances" },
        { status: 403 }
      );
    }

    // Determine user's plan (basic check - you might want to implement proper plan detection)
    let plan = "free_user";
    // This is a simplified plan detection - you'd implement proper Clerk subscription checking
    if (user.credits >= 24) {
      plan = "premium";
    } else if (user.credits >= 10) {
      plan = "standard";
    }

    return NextResponse.json({
      credits: user.credits,
      plan: plan
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit balance" },
      { status: 500 }
    );
  }
}
