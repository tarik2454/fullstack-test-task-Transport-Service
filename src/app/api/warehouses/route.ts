import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { withAuth } from "@/utils/withAuth";
import { errorResponse } from "@/utils/apiResponse";
import { warehouseCreateSchema } from "@/schemas/warehouseSchemas";
import { formatZodErrors } from "@/lib/zodUtils";

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const warehouses = await db.warehouse.findMany({
      where: { managerId: user.id },
    });

    return NextResponse.json(warehouses);
  } catch {
    return errorResponse();
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const data = await req.json();

    const parseResult = warehouseCreateSchema.safeParse(data);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

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
