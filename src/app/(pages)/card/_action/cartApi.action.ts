"use server"

import { getUserToken } from "@/Helpers/getUserToken/tokenuser";
import { headers } from "next/headers";













export async function addToCardAction2(productId: string, count: number) {
  const token = await getUserToken(); // التوكن الديناميكي

  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
    method: "PUT",
    headers: {
      token: token + "",           // نفس الأسلوب السهل
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ count }), // البودي يحتوي على count فقط
  });

  const data = await response.json();
  return data;
}



















export async function deleteCard2(cardId: string) {
  const token = await getUserToken(); // التوكن الديناميكي


  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${cardId}`, {
    method: "DELETE",
    headers: {
      token: token + "", // نفس الأسلوب السهل
    },
  });

  const data = await response.json();


  return data;
}









  export async function clearCard2() {
  const token = await getUserToken(); // التوكن الديناميكي

    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/`, {
      method: "DELETE",
     headers: {
      token: token + "", // نفس الأسلوب السهل
    },
    });

  const data = await response.json();

  
  return data;

  }



         // سيرفر اكشن

export async function placeOrderAction(
  cartId: string,
  shippingAddress: { details: string; city: string; phone: string }
) {
  const token = await getUserToken();

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
    {
      method: "POST",
      headers: {
        token: token + "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shippingAddress }),
    }
  );

  const data = await response.json();
  return data;
}



















export async function createCheckoutSessionVisa2(
  cartId: string,
  shippingAddress: { details: string; city: string; phone: string }
) {
  const token = await getUserToken();
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  const requestHeaders = await headers();
  const requestHost = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
  const requestProtocol = requestHeaders.get("x-forwarded-proto") || (process.env.NODE_ENV === "development" ? "http" : "https");
  const requestUrl = requestHost ? `${requestProtocol}://${requestHost}` : "http://127.0.0.1:3000";
  const appUrl = (configuredSiteUrl || requestUrl).replace(/\/$/, "");

  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${encodeURIComponent(appUrl)}`,
    {
      method: "POST",
      headers: {
        token: token + "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shippingAddress }),
    }
  );

  const data = await response.json();
  return data;
}





// السيرفر أكشن لتحديث البروفايل مع توكن ديناميكي
export async function updateProfileServerAction(formData: { name: string; email: string; phone?: string }) {
  const token = await getUserToken(); // توكن ديناميكي من السيرفر

  const res = await fetch("https://ecommerce.routemisr.com/api/v1/users/updateMe/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: token+'', // نفس الأسلوب المستخدم في باقي السيرفر أكشنز
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to update profile");
  }

  return data; // ارجاع بيانات المستخدم بعد التحديث لتحديث الجلسة
}
