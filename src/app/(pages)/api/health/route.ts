import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch("https://ecommerce.routemisr.com/api/v1/products", {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) throw new Error(`Upstream API returned ${response.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
