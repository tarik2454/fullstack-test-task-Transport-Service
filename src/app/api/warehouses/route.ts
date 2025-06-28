import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const warehouses = await prisma.warehouse.findMany();
  return NextResponse.json(warehouses);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const warehouse = await prisma.warehouse.create({ data });
  return NextResponse.json(warehouse);
}
