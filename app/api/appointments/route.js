import { getPatientAppointments } from "@/actions/patient";
import { getDoctorAppointments } from "@/actions/doctor";
import { bookAppointment } from "@/actions/appointments";
import { getCurrentUser } from "@/actions/onboarding";
import { NextResponse } from "next/server";

// GET: List appointments for the authenticated user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let result;
    if (user.role === "PATIENT") {
      result = await getPatientAppointments();
    } else if (user.role === "DOCTOR") {
      result = await getDoctorAppointments();
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid user role" },
        { status: 403 }
      );
    }

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    let appointments = result.appointments || [];

    // Apply filters
    if (status) {
      appointments = appointments.filter(apt => apt.status === status);
    }
    if (startDate) {
      appointments = appointments.filter(apt => 
        new Date(apt.startTime) >= new Date(startDate)
      );
    }
    if (endDate) {
      appointments = appointments.filter(apt => 
        new Date(apt.startTime) <= new Date(endDate)
      );
    }

    return NextResponse.json({ appointments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

// POST: Create a new appointment
export async function POST(request) {
  try {
    const formData = await request.formData();
    const result = await bookAppointment(formData);
    
    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to book appointment" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to book appointment" },
      { status: 500 }
    );
  }
}
