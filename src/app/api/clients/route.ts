import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/utils/apiResponse";
import { clientCreateSchema } from "@/schemas/zodSchemas";
import { formatZodErrors } from "@/lib/zodUtils";

export async function GET() {
  try {
    const user = await withAuth("MANAGER");
    if (!user) return errorResponse("Unauthorized", 401);

    const clients = await db.client.findMany({
      where: { managerId: user.id },
    });

    return NextResponse.json(clients);
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

    return NextResponse.json(client);
  } catch {
    return errorResponse();
  }
}
