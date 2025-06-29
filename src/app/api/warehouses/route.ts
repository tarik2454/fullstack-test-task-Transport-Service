import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export async function GET() {
  const warehouses = await db.warehouse.findMany();
  return NextResponse.json(warehouses);
}

interface User {
  id: string;
  role: string;
}

export async function POST(req: NextRequest) {
  const user = (await withAuth("MANAGER")) as User | null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  if (
    typeof data.name !== "string" ||
    !data.name.trim() ||
    typeof data.address !== "string" ||
    !data.address.trim()
  ) {
    return NextResponse.json(
      { error: "Поля name и address обязательны и должны быть строками" },
      { status: 400 }
    );
  }

  const warehouse = await db.warehouse.create({
    data: {
      name: data.name,
      address: data.address,
      managerId: user.id,
    },
  });

  return NextResponse.json(warehouse);
}
