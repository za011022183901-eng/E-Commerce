import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Your login session is missing or expired" }, { status: 401 });

  const { productId } = await params;
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      headers: { token },
      cache: "no-store",
    });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ message: "Unable to update your wishlist right now" }, { status: 502 });
  }
}
