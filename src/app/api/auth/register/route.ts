import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { registerSchema } from "@/schemas/zodSchemas";
import { errorResponse } from "@/utils/apiResponse";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parse = registerSchema.safeParse(body);
    if (!parse.success) {
      return errorResponse("Invalid data", 400);
    }

    const { email, password, firstName, lastName, role } = parse.data;

    const hashed = await hash(password, 10);

    const user = await db.user.create({
      data: { email, password: hashed, firstName, lastName, role },
    });

    return NextResponse.json({ user: { id: user.id, email: user.email } });
  } catch {
    return errorResponse();
  }
}
