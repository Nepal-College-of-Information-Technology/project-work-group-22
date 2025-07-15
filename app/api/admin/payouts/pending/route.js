import { getPendingPayouts } from "@/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getPendingPayouts();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === "Unauthorized" ? 403 : 500 }
      );
    }

    return NextResponse.json({
      payouts: result.payouts || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch pending payouts" },
      { status: 500 }
    );
  }
}
