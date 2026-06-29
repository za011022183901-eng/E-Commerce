"use server"

import { getUserToken } from "@/Helpers/getUserToken/tokenuser";

export async function removeWhslist(productId: string) {
  // ✅ جلب التوكن صح
  const token = await getUserToken();

  // ✅ المسار الصحيح للـ DELETE
  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      token: token || "",
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}
