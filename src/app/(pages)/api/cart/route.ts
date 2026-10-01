import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Your login session is missing or expired" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (typeof body?.productId !== "string" || !body.productId) {
    return NextResponse.json({ message: "A product ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
      method: "POST",
      headers: { token, "Content-Type": "application/json" },
      body: JSON.stringify({ productId: body.productId }),
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Unable to add this product right now" }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Your login session is missing or expired" }, { status: 401 });

  try {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart/", {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Unable to clear your cart right now" }, { status: 502 });
  }
}
