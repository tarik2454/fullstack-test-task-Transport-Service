import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const warehouse = await prisma.warehouse.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(warehouse);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.warehouse.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
