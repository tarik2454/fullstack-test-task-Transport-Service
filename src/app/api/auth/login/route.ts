import { db } from "@/utils/prisma";
import { compare } from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { errorResponse } from "@/utils/server/apiResponse";
import { formatZodErrors } from "@/utils/server/formatServerErrors";
import { loginSchema } from "@/schemas/authSchemas";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return errorResponse(formatZodErrors(parseResult.error), 400);
    }

    const user = await db.user.findUnique({ where: { email: body.email } });

    if (!user || !(await compare(body.password, user.password))) {
      return errorResponse("Incorrect email or password", 401);
    }

    const secret = new TextEncoder().encode(JWT_SECRET);

    const token = await new SignJWT({
      id: user.id,
      role: user.role,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    const res = NextResponse.json({ role: user.role });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch {
    return errorResponse();
  }
}
