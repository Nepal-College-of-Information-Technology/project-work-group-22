import { addAppointmentNotes, markAppointmentCompleted, cancelAppointment } from "@/actions/doctor";
import { getCurrentUser } from "@/actions/onboarding";
import { NextResponse } from "next/server";

// GET: Get appointment by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { db } = await import("@/lib/prisma");
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            imageUrl: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this appointment
    if (appointment.patientId !== user.id && appointment.doctorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized to view this appointment" },
        { status: 403 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
}

// PUT: Update appointment by ID
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const notes = formData.get("notes");
    const status = formData.get("status");

    let result;
    if (notes) {
      formData.set("appointmentId", id);
      result = await addAppointmentNotes(formData);
    } else if (status === "COMPLETED") {
      formData.set("appointmentId", id);
      result = await markAppointmentCompleted(formData);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid update parameters" },
        { status: 400 }
      );
    }

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update appointment" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update appointment" },
      { status: 500 }
    );
  }
}

// DELETE: Cancel appointment by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const formData = new FormData();
    formData.set("appointmentId", id);
    
    const result = await cancelAppointment(formData);
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to cancel appointment" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
