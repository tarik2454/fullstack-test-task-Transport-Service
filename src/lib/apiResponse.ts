import { NextResponse } from "next/server";

export function errorResponse(error: unknown = "Ошибка сервера", status = 500) {
  return NextResponse.json({ error }, { status });
}
