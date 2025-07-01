import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/utils/apiResponse";
import { registerSchema } from "@/schemas/authSchemas";
import { formatZodErrors } from "@/lib/zodUtils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = registerSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const { email, password, firstName, lastName, role } = parseResult.data;

    const hashed = await hash(password, 10);

    const user = await db.user.create({
      data: { email, password: hashed, firstName, lastName, role },
    });

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch {
    return errorResponse();
  }
}
