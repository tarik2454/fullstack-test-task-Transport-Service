import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { errorResponse } from "@/utils/server/apiResponse";
import { clientUpdateSchema } from "@/schemas/clientSchemas";
import { formatZodErrors } from "@/utils/zod/formatServerErrors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parseResult = clientUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const client = await db.client.update({
      where: { id: id },
      data: parseResult.data,
    });
    return NextResponse.json(client);
  } catch {
    return errorResponse();
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
