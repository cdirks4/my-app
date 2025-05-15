import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("GET /api/provider called");
    const providers = await prisma.providers.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        practice: true,
        org: true,
      },
    });
    return NextResponse.json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
