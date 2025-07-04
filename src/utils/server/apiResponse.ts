import { NextResponse } from "next/server";

export function errorResponse(error: unknown = "Server error", status = 500) {
  return NextResponse.json({ error }, { status });
}

export function successResponse(data: unknown = {}, status = 200) {
  return NextResponse.json(data, { status });
}
