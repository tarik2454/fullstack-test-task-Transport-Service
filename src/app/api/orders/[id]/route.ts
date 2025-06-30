import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/lib/apiResponse";

export async function PUT(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  try {
    const id = context.params.id;
    const data = await req.json();

    const order = await db.order.update({
      where: { id },
      data,
      include: { warehouse: true, client: true },
    });

    return NextResponse.json(order);
  } catch {
    return errorResponse();
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;

    await db.order.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return errorResponse();
  }
}
