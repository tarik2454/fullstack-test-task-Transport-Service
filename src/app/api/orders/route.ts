import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/lib/apiResponse";

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }
    const managerId = (user as { id: string }).id;

    const orders = await db.order.findMany({ where: { managerId } });

    return NextResponse.json(orders);
  } catch {
    return errorResponse();
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await withAuth("MANAGER");
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }
    const data = await req.json();

    const order = await db.order.create({
      data: { ...data, managerId: (user as { id: string }).id },
    });

    return NextResponse.json(order);
  } catch {
    return errorResponse();
  }
}
