import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

import { Prisma } from "@prisma/client";
import { errorResponse } from "@/lib/apiResponse";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await req.json();

    const client = await db.client.update({
      where: { id: id },
      data,
    });
    return NextResponse.json(client);
  } catch {
    return errorResponse();
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await db.client.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return errorResponse(
        "Невозможно удалить клиента: есть связанные заказы",
        409
      );
    }
    return errorResponse();
  }
}
