import { getCurrentUser } from "@/actions/onboarding";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { db } = await import("@/lib/prisma");
    const transactions = await db.creditTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit
    });

    const total = await db.creditTransaction.count({
      where: { userId: user.id }
    });

    return NextResponse.json({
      transactions,
      total
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch credit transactions" },
      { status: 500 }
    );
  }
}
