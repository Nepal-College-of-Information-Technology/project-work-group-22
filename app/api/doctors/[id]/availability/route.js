import { getAvailableTimeSlots } from "@/actions/appointments";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await getAvailableTimeSlots(id);
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      days: result.days || []
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
