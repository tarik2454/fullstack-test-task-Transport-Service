import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/lib/apiResponse";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();

    const order = await db.order.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(order);
  } catch {
    return errorResponse("Ошибка при обновлении статуса заказа");
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();

    const order = await db.order.update({
      where: { id },
      data,
    });

    return NextResponse.json(order);
  } catch {
    return errorResponse();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await db.order.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse();
  }
}
