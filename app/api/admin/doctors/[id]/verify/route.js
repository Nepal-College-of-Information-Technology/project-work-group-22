import { updateDoctorStatus } from "@/actions/admin";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    formData.set("doctorId", id);
    
    const result = await updateDoctorStatus(formData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update doctor status" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update doctor status" },
      { status: error.message === "Unauthorized" ? 403 : 500 }
    );
  }
}
