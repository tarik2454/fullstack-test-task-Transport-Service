import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/lib/apiResponse";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status, driverId }: { status: string; driverId?: string } =
      await req.json();


    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      return errorResponse("Неверный статус", 400);
    }

    const currentOrder = await db.order.findUnique({
      where: { id: params.id },
    });

    if (!currentOrder) {
      return errorResponse("Заказ не найден", 404);
    }


    const dataToUpdate: {
      status: OrderStatus;
      driverId?: string;
    } = {
      status: status as OrderStatus,
      ...(currentOrder.status === "NEW" && status !== "NEW" && driverId
        ? { driverId }
        : {}),
    };

    const updatedOrder = await db.order.update({
      where: { id: params.id },
      data: dataToUpdate,
      include: { warehouse: true, client: true },
    });

    return NextResponse.json(updatedOrder);
  } catch (err) {
    console.error(err);
    return errorResponse("Ошибка при обновлении статуса заказа");
  }
}
