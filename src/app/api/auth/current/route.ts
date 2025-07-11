import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/verifyToken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { user: null, message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { user: null, message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user: payload }, { status: 200 });
}
