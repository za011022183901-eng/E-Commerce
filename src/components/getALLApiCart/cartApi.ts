// /Helpers/api/cart.ts
import { getUserToken } from "@/Helpers/getUserToken/tokenuser";

// ================== GET CART ==================
export async function getCartData() {
  const token = getUserToken();
  if (!token) throw new Error("User not authenticated");

  const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

// ================== DELETE ITEM ==================
export async function deleteCartItem(cartId: string) {
  const token = getUserToken();
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${cartId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) throw new Error("Failed to delete cart item");
  return res.json();
}

// ================== UPDATE ITEM ==================
export async function updateCartItem(productId: string, count: number) {
  const token = getUserToken();
  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
    method: "PUT",
    headers: { 
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ count }),
  });

  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
}

// ================== CLEAR CART ==================
export async function clearCart() {
  const token = getUserToken();
  if (!token) throw new Error("User not authenticated");

  const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });

  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
}
