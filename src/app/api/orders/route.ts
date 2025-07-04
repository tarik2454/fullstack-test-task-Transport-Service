import { withAuth } from "@/utils/auth/withAuth";
import { NextRequest } from "next/server";
import { db } from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/server/apiResponse";
import { orderCreateSchema } from "@/schemas/orderSchemas";
import { formatZodErrors } from "@/utils/zod/formatServerErrors";

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }
    const managerId = (user as { id: string }).id;

    const orders = await db.order.findMany({
      where: { managerId },
      include: {
        client: true,
        warehouse: true,
        manager: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        driver: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return successResponse(orders);
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

    const { id: managerId } = user as { id: string };

    const body = await req.json();

    const parseResult = orderCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const order = await db.order.create({
      data: {
        ...body,
        managerId,
      },
    });

    return successResponse(order);
  } catch {
    return errorResponse();
  }
}
