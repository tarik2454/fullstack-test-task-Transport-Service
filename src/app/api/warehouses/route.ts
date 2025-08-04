import { NextRequest } from "next/server";
import { db } from "@/utils/prisma";
import { withAuth } from "@/app/api/_utils/auth/withAuth";
import { errorResponse, successResponse } from "@/app/api/_utils/apiResponse";
import { warehouseCreateSchema } from "@/schemas/warehouseSchemas";
import { formatZodErrors } from "@/app/api/_utils/formatServerErrors";

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const managerId = user.id;

    const warehouses = await db.warehouse.findMany({
      where: { managerId },
    });

    return successResponse(warehouses);
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

    return successResponse(warehouse);
  } catch {
    return errorResponse();
  }
}
