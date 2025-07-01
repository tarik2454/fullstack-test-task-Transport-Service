import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/utils/apiResponse";
import { orderUpdateSchema } from "@/schemas/orderSchemas";
import { formatZodErrors } from "@/lib/zodUtils";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = orderUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const order = await db.order.update({
      where: { id },
      data: body,
      include: { warehouse: true, client: true },
    });

    return NextResponse.json(order);
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

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse();
  }
}
