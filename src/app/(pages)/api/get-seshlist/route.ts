"use server";

import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { WishlistResponse } from "@/interfaces";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await getUserToken(); // ✅ استخدم await

    const response = await fetch('https://ecommerce.routemisr.com/api/v1/wishlist', {
        method: 'GET', // اختياري بس واضح
        headers: {
            token: token + '',
        },
    });

    const data: WishlistResponse = await response.json();
    
    return NextResponse.json(data);
}
