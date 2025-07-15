import { generateVideoToken } from "@/actions/appointments";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await generateVideoToken(formData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to generate video token" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate video token" },
      { status: 500 }
    );
  }
}
