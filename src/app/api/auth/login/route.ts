import { db } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await db.user.findUnique({ where: { email } });

  if (!user || !(await compare(password, user.password))) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 401 });
  }

  const token = sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  const res = NextResponse.json({ role: user.role });
  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
