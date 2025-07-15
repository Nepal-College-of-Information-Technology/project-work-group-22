import { getDoctorPayouts, requestPayout } from "@/actions/payout";
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
        { success: false, error: "Only doctors can access payout information" },
        { status: 403 }
      );
    }

    const result = await getDoctorPayouts();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      payouts: result.payouts || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch payout history" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
        { success: false, error: "Only doctors can request payouts" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const result = await requestPayout(formData);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to request payout" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to request payout" },
      { status: 500 }
    );
  }
}
