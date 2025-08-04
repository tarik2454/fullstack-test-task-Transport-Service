import { cookies } from "next/headers";
import { verifyToken } from "./verifyToken";

type JwtPayload = {
  id: string;
  role: "MANAGER" | "DRIVER";
};

export async function withAuth(
  expectedRole: "MANAGER" | "DRIVER"
): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = await verifyToken(token);

  if (!payload) return null;

  const typedPayload = payload as JwtPayload;

  if (typedPayload.role !== expectedRole) return null;

  return typedPayload;
}
