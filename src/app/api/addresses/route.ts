import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://ecommerce.routemisr.com/api/v1/addresses";

export async function GET(request: NextRequest) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  try {
    const response = await fetch(API_URL, {
      headers: { token }, cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ message: "Address service is temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid address details" }, { status: 400 }); }
  try {
    const response = await fetch(API_URL, {
      method: "POST", headers: { token, "Content-Type": "application/json" },
      body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    const text = await response.text();
    return new NextResponse(text || null, { status: response.status, headers: text ? { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } : undefined });
  } catch {
    return NextResponse.json({ message: "Address service is temporarily unavailable" }, { status: 503 });
  }
}
