import { withAuth } from "@/utils/auth/withAuth";
import { NextRequest } from "next/server";
import { db } from "@/utils/prisma";
import { errorResponse, successResponse } from "@/utils/server/apiResponse";
import { clientCreateSchema } from "@/schemas/clientSchemas";
import { formatZodErrors } from "@/utils/zod/formatServerErrors";

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const clients = await db.client.findMany({
      where: { managerId: user.id },
    });

    return successResponse(clients);
  } catch {
    return errorResponse();
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);
    const data = await req.json();

    const parseResult = clientCreateSchema.safeParse(data);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const client = await db.client.create({
      data: { ...data, managerId: user.id },
    });

    return successResponse(client);
  } catch {
    return errorResponse();
  }
}
