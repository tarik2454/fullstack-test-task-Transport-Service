import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function withAuth(expectedRole: "MANAGER" | "DRIVER") {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || payload.role !== expectedRole) return null;
  return payload;
}
