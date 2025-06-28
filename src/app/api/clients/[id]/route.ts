import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const client = await prisma.client.update({ where: { id: params.id }, data });
  return NextResponse.json(client);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.client.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
