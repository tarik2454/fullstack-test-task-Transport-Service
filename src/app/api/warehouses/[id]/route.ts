import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { errorResponse } from "@/lib/apiResponse";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  const data = await req.json();

  try {
    const warehouse = await db.warehouse.update({
      where: { id },
      data,
    });
    return NextResponse.json(warehouse);
  } catch {
    return errorResponse("Ошибка при обновлении склада");
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;

  try {
    await db.warehouse.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return errorResponse(
        "Невозможно удалить склад: к нему привязаны заказы",
        409
      );
    }
    return errorResponse();
  }
}
