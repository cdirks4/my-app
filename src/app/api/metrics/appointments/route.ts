import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

const monthOrder = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function GET() {
  try {
    console.log("Fetching appointment metrics...");
    const appointments = await prisma.appointments.groupBy({
      by: ["date"],
      _count: {
        id: true,
      },
      where: {
        pm_status: "occurred",
        date: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    console.log("Raw appointments data:", { appointments });

    // Group by month for better visualization
    const monthlyAppointments = appointments.reduce((acc, curr) => {
      const month = curr.date.toLocaleDateString("en-US", { month: "short" });
      const monthIndex = monthOrder.indexOf(month);
      if (!acc[month]) {
        acc[month] = {
          count: 0,
          monthIndex: monthIndex,
        };
      }
      acc[month].count += curr._count.id;
      return acc;
    }, {} as Record<string, { count: number; monthIndex: number }>);

    console.log("Monthly grouped appointments:", monthlyAppointments);

    const metrics = Object.entries(monthlyAppointments)
      .map(([month, data]) => ({
        date: month,
        count: data.count,
        monthIndex: data.monthIndex,
      }))
      .sort((a, b) => a.monthIndex - b.monthIndex);

    console.log("Final appointment metrics:", metrics);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching appointment metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
