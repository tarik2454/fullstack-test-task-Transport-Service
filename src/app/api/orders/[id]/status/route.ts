import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/lib/apiResponse";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status }: { status: string } = await req.json();

    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      return errorResponse("Неверный статус", 400);
    }

    const currentOrder = await db.order.findUnique({
      where: { id: params.id },
    });
    if (!currentOrder) {
      return errorResponse("Заказ не найден", 404);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return errorResponse("Нет токена", 401);

    const payload = await verifyToken(token);
    if (!payload || payload.role !== "DRIVER") {
      return errorResponse("Нет прав", 403);
    }

    const driverIdFromToken = payload.id;

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
