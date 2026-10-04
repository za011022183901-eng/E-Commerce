import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { NextRequest, NextResponse } from "next/server";

async function addressRequest(request: NextRequest, params: Promise<{ addressId: string }>, method: "GET" | "DELETE") {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  const { addressId } = await params;
  if (!/^[\w-]+$/.test(addressId)) return NextResponse.json({ message: "Invalid address id" }, { status: 400 });
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${encodeURIComponent(addressId)}`, {
      method, headers: { token }, cache: "no-store", signal: AbortSignal.timeout(8000),
    });
    if (method === "GET") return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } });
    const text = await response.text();
    return new NextResponse(text || null, { status: response.status, headers: text ? { "Content-Type": response.headers.get("Content-Type") ?? "application/json" } : undefined });
  } catch {
    return NextResponse.json({ message: "Address service is temporarily unavailable" }, { status: 503 });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ addressId: string }> }) {
  return addressRequest(request, context.params, "GET");
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ addressId: string }> }) {
  return addressRequest(request, context.params, "DELETE");
}
