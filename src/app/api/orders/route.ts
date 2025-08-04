import { withAuth } from "@/app/api/_utils/auth/withAuth";
import { NextRequest } from "next/server";
import { db } from "@/utils/prisma";
import { errorResponse, successResponse } from "@/app/api/_utils/apiResponse";
import { orderCreateSchema } from "@/schemas/commonOrderSchemas";
import { formatZodErrors } from "@/app/api/_utils/formatServerErrors";

const orderInclude = {
  client: true,
  warehouse: true,
  manager: { select: { firstName: true, lastName: true } },
  driver: { select: { firstName: true, lastName: true } },
};

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const managerId = user.id;

    const orders = await db.order.findMany({
      where: { managerId },
      include: orderInclude,
    });

    return successResponse(orders);
  } catch {
    return errorResponse();
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const { id: managerId } = user;

    const body = await req.json();

    const parseResult = orderCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const order = await db.order.create({
      data: {
        ...parseResult.data,
        managerId,
      },
      include: orderInclude,
    });

    return successResponse(order);
  } catch {
    return errorResponse();
  }
}
