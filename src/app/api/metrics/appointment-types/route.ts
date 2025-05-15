import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Fetching appointment type metrics...");
    const appointmentTypes =
      await prisma.aggregated_appointment_metrics.findMany({
        select: {
          week_start_date: true,
          appointment_type: true,
          mean_duration_in_hours: true,
        },
        where: {
          week_start_date: {
            gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // Changed to fetch last year of data
          },
        },
        orderBy: {
          week_start_date: "asc",
        },
      });

    console.log("Raw appointment types data:", appointmentTypes);

    // Group by week and appointment type
    const groupedData = appointmentTypes.reduce((acc, curr) => {
      const week = curr.week_start_date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!acc[week]) {
        acc[week] = {
          newPatient: 0,
          established: 0,
          newVisit: 0,
          establishedLong: 0,
        };
      }

      // Updated mapping logic to match actual appointment types
      if (curr.appointment_type.includes("New Patient")) {
        acc[week].newPatient = curr.mean_duration_in_hours * 100;
      } else if (
        curr.appointment_type.includes("Follow-up") ||
        curr.appointment_type.includes("Medication Refill") ||
        curr.appointment_type.includes("Established Patient")
      ) {
        acc[week].established = curr.mean_duration_in_hours * 100;
      } else if (curr.appointment_type === "New Patient Visit") {
        acc[week].newVisit = curr.mean_duration_in_hours * 100;
      } else if (
        curr.appointment_type.includes("Annual Visit") ||
        curr.appointment_type.includes("Hormone Optimization")
      ) {
        acc[week].establishedLong = curr.mean_duration_in_hours * 100;
      }
      // Skip "Aggregated Appointments" as they're already counted in their specific types

      return acc;
    }, {} as Record<string, any>);

    console.log("Grouped appointment types data:", groupedData);

    const metrics = Object.entries(groupedData).map(([week, data]) => ({
      week,
      ...data,
    }));

    console.log("Final appointment type metrics:", metrics);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching appointment type metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
