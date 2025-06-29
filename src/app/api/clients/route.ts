import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const user = (await withAuth("MANAGER")) as { id: string } | null;
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const clients = await db.client.findMany({
    where: { managerId: user.id },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const user = await withAuth("MANAGER");
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const client = await db.client.create({
    data: { ...data, managerId: user.id },
  });
  return NextResponse.json(client);
}
