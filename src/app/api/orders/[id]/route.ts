import { NextRequest } from "next/server";
import { db } from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/server/apiResponse";
import { orderCreateSchema } from "@/schemas/commonOrderSchemas";
import { formatZodErrors } from "@/utils/server/formatServerErrors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = orderCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const order = await db.order.update({
      where: { id },
      data: body,
      include: { warehouse: true, client: true },
    });

    return successResponse(order);
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

    await db.order.delete({ where: { id } });

    return successResponse({ success: true });
  } catch {
    return errorResponse();
  }
}
