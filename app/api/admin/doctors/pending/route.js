import { getPendingDoctors } from "@/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await getPendingDoctors();
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === "Unauthorized" ? 403 : 500 }
      );
    }

    return NextResponse.json({
      doctors: result.doctors || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch pending doctors" },
      { status: 500 }
    );
  }
}
