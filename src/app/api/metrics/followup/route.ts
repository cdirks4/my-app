import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const provider_id = searchParams.get("provider_id");

  const where = provider_id ? { provider_id } : {};

  try {
    console.log("Fetching followup metrics...");
    const followups = await prisma.projected_appointment_metrics.findMany({
      select: {
        week_start_date: true,
        in_visit_followup_rate: true,
      },
      where: {
        week_start_date: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
        ...where,
      },
      orderBy: {
        week_start_date: "asc",
      },
    });

    // Aggregate data by date to get average followup rate
    const aggregatedData = followups.reduce((acc, curr) => {
      const date = curr.week_start_date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = {
          total: 0,
          count: 0,
        };
      }

      if (curr.in_visit_followup_rate) {
        acc[date].total += curr.in_visit_followup_rate;
        acc[date].count += 1;
      }

      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const metrics = Object.entries(aggregatedData).map(([date, data]) => ({
      date,
      actual: Math.round((data.total / data.count) * 100),
      goal: 40,
    }));

    console.log("Followup metrics:", metrics);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching followup metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
