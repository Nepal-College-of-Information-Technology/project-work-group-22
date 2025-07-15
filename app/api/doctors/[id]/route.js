import { getDoctorById } from "@/actions/appointments";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await getDoctorById(id);
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json(result.doctor);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}
