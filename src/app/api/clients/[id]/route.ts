import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json();
  const client = await db.client.update({ where: { id: params.id }, data });
  return NextResponse.json(client);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  await db.client.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
