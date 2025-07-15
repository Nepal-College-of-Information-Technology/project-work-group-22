import { db } from "@/lib/prisma";

export async function GET() {
  const timestamp = new Date().toISOString();
  const services = {
    database: "disconnected",
    vonage: "connected", // Assuming Vonage is configured
    clerk: "connected"   // Assuming Clerk is configured
  };

  // Check database connectivity
  try {
    await db.$queryRaw`SELECT 1`;
    services.database = "connected";
  } catch (error) {
    console.error("Database health check failed:", error);
    services.database = "disconnected";
  }

  // Check Vonage API (basic check for required env vars)
  if (!process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID || !process.env.VONAGE_PRIVATE_KEY) {
    services.vonage = "disconnected";
  }

  // Check Clerk (basic check for required env vars)
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    services.clerk = "disconnected";
  }

  const allServicesHealthy = Object.values(services).every(status => status === "connected");
  const status = allServicesHealthy ? "healthy" : "unhealthy";

  return new Response(
    JSON.stringify({
      status,
      timestamp,
      services
    }),
    {
      status: allServicesHealthy ? 200 : 503,
      headers: { "Content-Type": "application/json" }
    }
  );
}
