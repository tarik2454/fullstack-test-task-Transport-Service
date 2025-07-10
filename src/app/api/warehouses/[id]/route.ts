import { NextRequest } from "next/server";
import { db } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { errorResponse, successResponse } from "@/utils/server/apiResponse";
import { formatZodErrors } from "@/utils/server/formatServerErrors";
import { warehouseCreateSchema } from "@/schemas/warehouseSchemas";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const parseResult = warehouseCreateSchema.safeParse(data);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const warehouse = await db.warehouse.update({
      where: { id },
      data,
    });
    return successResponse(warehouse);
  } catch {
    return errorResponse();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.warehouse.delete({ where: { id } });
    return successResponse({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return errorResponse(
        "Unable to delete a warehouse: orders are linked to it",
        409
      );
    }
    return errorResponse();
  }
}
