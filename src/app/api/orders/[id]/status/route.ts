import { NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { errorResponse, successResponse } from "@/utils/apiResponse";
import { withAuth } from "@/utils/withAuth";
import { orderStatusUpdateSchema } from "@/schemas/orderSchemas";
import { formatZodErrors } from "@/lib/zodUtils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = orderStatusUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const { status } = parseResult.data;

    const currentOrder = await db.order.findUnique({
      where: { id: id },
    });
    if (!currentOrder) {
      return errorResponse("Order not found", 404);
    }

    const user = await withAuth("DRIVER");
    if (!user) return errorResponse("Unauthorized", 401);

    const driverIdFromToken = user.id;

    const dataToUpdate: {
      status: OrderStatus;
      driverId?: string;
    } = {
      status: status as OrderStatus,
      ...(currentOrder.status === "NEW" && status !== "NEW"
        ? { driverId: driverIdFromToken as string }
        : {}),
    };

    const updatedOrder = await db.order.update({
      where: { id: id },
      data: dataToUpdate,
      include: { warehouse: true, client: true },
    });

    return successResponse(updatedOrder);
  } catch {
    return errorResponse();
  }
}
