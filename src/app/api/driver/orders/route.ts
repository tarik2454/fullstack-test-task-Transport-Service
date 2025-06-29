import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { errorResponse } from "@/lib/apiResponse";

type JwtPayload = {
  id: string;
  role: "DRIVER" | "MANAGER";
};

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return errorResponse("Нет токена", 401);

    let payload: JwtPayload;
    try {
      payload = (await verifyToken(token)) as JwtPayload;
    } catch {
      return errorResponse("Невалидный токен", 401);
    }

    if (payload.role !== "DRIVER") {
      return errorResponse("Нет прав", 403);
    }

    const orders = await db.order.findMany({
      where: {
        OR: [
          { status: "NEW" },
          {
            status: { not: "NEW" },
            driverId: payload.id,
          },
        ],
      },
      include: {
        warehouse: true,
        client: true,
      },
    });

    return NextResponse.json(orders);
  } catch {
    return errorResponse();
  }
}
