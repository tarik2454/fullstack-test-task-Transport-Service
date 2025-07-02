import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { db } from "@/lib/prisma";
import { errorResponse } from "@/utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return errorResponse("Unauthorized", 401);
    }

    let payload;
    try {
      payload = verify(token, JWT_SECRET) as { id: string; role: string };
    } catch {
      return errorResponse("Invalid token", 401);
    }

    const user = await db.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return NextResponse.json(user);
  } catch {
    return errorResponse();
  }
}
