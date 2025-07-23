import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/verifyToken";
import { errorResponse, successResponse } from "@/utils/server/apiResponse";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return errorResponse("Unauthorized: No session token", 401);
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return errorResponse("Unauthorized: Invalid token", 401);
    }

    const res = successResponse({ message: "Logged out" });
    res.cookies.set("token", "", { maxAge: 0, path: "/" });

    return res;
  } catch {
    return errorResponse();
  }
}
