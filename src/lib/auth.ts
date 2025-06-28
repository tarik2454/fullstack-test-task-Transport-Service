import { jwtVerify } from "jose";

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "secret")
    );
    return payload;
  } catch {
    return null;
  }
}
