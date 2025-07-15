import { approvePayout } from "@/actions/admin";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const formData = new FormData();
    formData.set("payoutId", id);
    
    const result = await approvePayout(formData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to approve payout" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to approve payout" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
