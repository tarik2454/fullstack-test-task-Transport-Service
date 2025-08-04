import { db } from "@/utils/prisma";
import { errorResponse, successResponse } from "@/app/api/_utils/apiResponse";
import { withAuth } from "@/app/api/_utils/auth/withAuth";

export async function GET() {
  try {
    const user = await withAuth("DRIVER");
    if (!user) return errorResponse("Unauthorized", 401);

    const orders = await db.order.findMany({
      where: {
        OR: [{ status: "NEW" }, { driverId: user.id }],
      },
      include: {
        warehouse: true,
        client: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return successResponse(orders);
  } catch {
    return errorResponse();
  }
}
