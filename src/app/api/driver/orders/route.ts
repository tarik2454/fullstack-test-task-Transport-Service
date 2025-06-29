import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const orders = await db.order.findMany({
    where: {
      OR: [
        { status: "NEW" },
        { status: { not: "NEW" }, driverId: "mock-driver-id" }, // заменить на auth ID
      ],
    },
    include: {
      warehouse: true,
      client: true,
    },
  });
  return NextResponse.json(orders);
}
