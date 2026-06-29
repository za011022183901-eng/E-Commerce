"use server"

import { getUserToken } from "@/Helpers/getUserToken/tokenuser";

export async function addWhslist(productId: string) {
    const token = await getUserToken(); // ✅ تعديل سهل

    const res = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
        method: "POST",
        headers: {
            token: token + '',
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    return data;
}
