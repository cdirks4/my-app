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
    console.log("Fetching revenue metrics...");
    const revenue = await prisma.claims.groupBy({
      by: ["date_of_service"],
      _sum: {
        total_charge: true,
      },
      where: {
        date_of_service: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
        total_charge: {
          not: null,
        },
      },
      orderBy: {
        date_of_service: "asc",
      },
    });

    console.log("Raw revenue data:", revenue);

    // Fallback to mock data if no real data
    let monthlyRevenue;
    if (revenue.length === 0) {
      monthlyRevenue = {
        Jan: { amount: 10000, monthIndex: 0 },
        Feb: { amount: 12000, monthIndex: 1 },
        Mar: { amount: 9000, monthIndex: 2 },
        Apr: { amount: 15000, monthIndex: 3 },
        May: { amount: 11000, monthIndex: 4 },
      };
    } else {
      monthlyRevenue = revenue.reduce((acc, curr) => {
        const month = curr.date_of_service?.toLocaleDateString("en-US", {
          month: "short",
        });
        const monthIndex = monthOrder.indexOf(month);
        if (!acc[month]) {
          acc[month] = {
            amount: 0,
            monthIndex: monthIndex,
          };
        }
        acc[month].amount += curr._sum.total_charge || 0;
        return acc;
      }, {} as Record<string, { amount: number; monthIndex: number }>);
    }

    const metrics = Object.entries(monthlyRevenue)
      .map(([month, data]) => ({
        date: month,
        amount: Math.round(data.amount),
        monthIndex: data.monthIndex,
      }))
      .sort((a, b) => a.monthIndex - b.monthIndex);

    console.log("Final revenue metrics:", metrics);
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Error fetching revenue metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
