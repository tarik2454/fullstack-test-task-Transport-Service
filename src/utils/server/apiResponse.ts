import { NextResponse } from "next/server";

export function successResponse(data: unknown = {}) {
  return NextResponse.json({ success: true, data });
}

export function errorResponse(error: unknown = "Server error", status = 500) {
  return NextResponse.json({ success: false, error }, { status });
}
