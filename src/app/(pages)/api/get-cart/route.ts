import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = await getUserToken(request);
  if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

  try {
    const response = await fetch(`${process.env.URL_API || "https://ecommerce.routemisr.com/api/v1"}/cart`, {
      headers: { token },
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Unable to load cart" }, { status: 502 });
  }
}
