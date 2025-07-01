import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { errorResponse } from "@/utils/apiResponse";
import { formatZodErrors } from "@/lib/zodUtils";
import { warehouseUpdateSchema } from "@/schemas/warehouseSchemas";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await req.json();

  const parseResult = warehouseUpdateSchema.safeParse(data);
  if (!parseResult.success) {
    return errorResponse(formatZodErrors(parseResult.error), 400);
  }

  try {
    const warehouse = await db.warehouse.update({
      where: { id },
      data,
    });
    return NextResponse.json(warehouse);
  } catch {
    return errorResponse();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await db.warehouse.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
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
