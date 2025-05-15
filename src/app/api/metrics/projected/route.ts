import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const provider_id = searchParams.get("provider_id");
    console.log("API received provider_id:", provider_id);

    const where = provider_id ? { provider_id } : {};

    const projectedMetrics =
      await prisma.projected_appointment_metrics.findMany({
        where,
        orderBy: {
          week_start_date: "asc",
        },
        select: {
          week_start_date: true,
          provider_id: true,
          upcoming_existing_patient_appointments: true,
          upcoming_new_patient_appointments: true,
          occurred_rate: true,
          total_potential_appointments: true,
          trailing_weekly_revenue: true,
          availability_hours: true,
          booked_rate: true,
        },
      });

    console.log("API returning metrics count:", projectedMetrics.length);
    return NextResponse.json(projectedMetrics);
  } catch (error) {
    console.error("Error fetching projected metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch projected metrics" },
      { status: 500 }
    );
  }
}
