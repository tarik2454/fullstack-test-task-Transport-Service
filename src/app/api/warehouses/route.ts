import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const warehouses = await db.warehouse.findMany({
      where: { managerId: user.id },
    });

    return NextResponse.json(warehouses);
  } catch (error) {
    console.error("GET /api/warehouses error:", error);
    return errorResponse();
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const data = await req.json();

    const warehouse = await db.warehouse.create({
      data: {
        name: data.name,
        address: data.address,
        managerId: user.id,
      },
    });

    return NextResponse.json(warehouse);
  } catch {
    return errorResponse();
  }
}
