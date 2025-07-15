import { getDoctorEarnings } from "@/actions/payout";
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

    if (user.role !== "DOCTOR") {
      return NextResponse.json(
        { success: false, error: "Only doctors can access earnings information" },
        { status: 403 }
      );
    }

    const result = await getDoctorEarnings();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      earnings: result.earnings || {}
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch earnings summary" },
      { status: 500 }
    );
  }
}
