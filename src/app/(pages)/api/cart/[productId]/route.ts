import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

  const { productId } = await params;
  const body = await request.json().catch(() => null);
  const count = body?.count;
  if (!Number.isInteger(count) || count < 1) {
    return NextResponse.json({ message: "Quantity must be a positive whole number" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${encodeURIComponent(productId)}`, {
      method: "PUT",
      headers: { token, "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Unable to update cart" }, { status: 502 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Your login session is missing or expired" }, { status: 401 });

  const { productId } = await params;
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Unable to remove this product right now" }, { status: 502 });
  }
}
