import { getDoctorsBySpecialty } from "@/actions/doctors-listing";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get("specialty");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    let result;
    if (specialty) {
      result = await getDoctorsBySpecialty(specialty);
    } else {
      // If no specialty, get all verified doctors
      const { db } = await import("@/lib/prisma");
      const doctors = await db.user.findMany({
        where: {
          role: "DOCTOR",
          verificationStatus: "VERIFIED"
        },
        skip: offset,
        take: limit,
        orderBy: { name: "asc" }
      });
      result = { doctors };
    }

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const doctors = result.doctors || [];
    const hasMore = doctors.length === limit;
    const total = doctors.length; // This is approximate for performance

    return NextResponse.json({
      doctors,
      total,
      hasMore
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
