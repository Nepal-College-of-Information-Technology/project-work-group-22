import { setAvailabilitySlots } from "@/actions/doctor";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await setAvailabilitySlots(formData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to set availability" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to set availability" },
      { status: 500 }
    );
  }
}
