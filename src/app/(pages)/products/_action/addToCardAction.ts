"use server"

import { getUserToken } from "@/Helpers/getUserToken/tokenuser";

export async function addToCardAction(productId: string) {
  const token = await getUserToken(); // هنا استخدمنا الديناميكي

  const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    method: "POST",
    headers: {
      token: token + "", // بدل الستاتيك
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });

  const data = await response.json();
  return data;
}
