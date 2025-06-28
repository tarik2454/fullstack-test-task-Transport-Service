import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { status } = await req.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });
  return NextResponse.json(order);
}
