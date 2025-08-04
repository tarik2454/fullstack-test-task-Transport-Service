import { hash } from "bcryptjs";
import { db } from "@/utils/prisma";
import { errorResponse, successResponse } from "@/app/api/_utils/apiResponse";
import { registerSchema } from "@/schemas/authSchemas";
import { formatZodErrors } from "@/app/api/_utils/formatServerErrors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const { email, password, firstName, lastName, role } = parseResult.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse("User with this email already exists", 409);
    }

    const hashed = await hash(password, 10);

    const user = await db.user.create({
      data: { email, password: hashed, firstName, lastName, role },
    });

    return successResponse({ user: { id: user.id, email: user.email } });
  } catch {
    return errorResponse();
  }
}
