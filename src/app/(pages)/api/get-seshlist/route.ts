import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { WishlistResponse } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = await getUserToken(request);
    if (!token) return NextResponse.json({ message: "Authentication required" }, { status: 401 });

    try {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
            headers: { token },
            cache: "no-store",
        });
        const data: WishlistResponse = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: "Unable to load wishlist" }, { status: 502 });
    }
}
