import { NextRequest } from "next/server";
import { db } from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { errorResponse, successResponse } from "@/app/api/_utils/apiResponse";
import { clientSchema } from "@/schemas/clientSchemas";
import { formatZodErrors } from "@/app/api/_utils/formatServerErrors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const parseResult = clientSchema.safeParse(data);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const client = await db.client.update({
      where: { id },
      data,
    });

    return successResponse(client);
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
    return successResponse({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return errorResponse(
        "Unable to delete a customer: there are related orders",
        409
      );
    }
    return errorResponse();
  }
}
