import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await withAuth("MANAGER");
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await prisma.order.findMany({ where: { managerId: user.id } });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const user = await withAuth("MANAGER");
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const order = await prisma.order.create({
    data: { ...data, managerId: user.id },
  });
  return NextResponse.json(order);
}
