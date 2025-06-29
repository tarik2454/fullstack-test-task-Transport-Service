import { NextResponse } from "next/server";

export function errorResponse(message = "Ошибка сервера", status = 500) {
  return NextResponse.json({ error: message }, { status });
}
