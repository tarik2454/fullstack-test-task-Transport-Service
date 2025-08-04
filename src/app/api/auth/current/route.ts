import { cookies } from "next/headers";
import { verifyToken } from "@/app/api/_utils/auth/verifyToken";
import { successResponse, errorResponse } from "@/app/api/_utils/apiResponse";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get?.("token")?.value;

  if (!token) {
    return errorResponse("Unauthorized: No session token", 401);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return errorResponse("Unauthorized: Invalid token", 401);
  }

  return successResponse({ user: payload });
}
