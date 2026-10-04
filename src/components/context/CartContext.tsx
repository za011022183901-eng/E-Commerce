"use client";

import { CartResponce, WishlistResponse } from "@/interfaces";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useState } from "react";

export const cartContext = createContext<{
  cartData: CartResponce | null;
  SetCartData: (value: CartResponce | null) => void;
  loading: boolean;
  SetLoading: (value: boolean) => void;
  getCart: () => void;

  wishlistData: WishlistResponse | null;
  SetWishlist: (value: WishlistResponse | null) => void;
  getWishlist: () => void;
}>({
  cartData: null,
  SetCartData: () => {},
  loading: false,
  SetLoading: () => {},
  getCart: () => {},
  wishlistData: null,
  SetWishlist: () => {},
  getWishlist: () => {},
});

export default function GetCartContext({ children }: { children: ReactNode }) {
  const session = useSession();

  const [wishlistData, SetWishlist] = useState<WishlistResponse | null>(null);
  const [cartData, SetCartData] = useState<CartResponce | null>(null);
  const [loading, SetLoading] = useState<boolean>(true);

  async function getCart() {
    try {
      const response = await fetch("/api/get-cart", { credentials: "same-origin", cache: "no-store", signal: AbortSignal.timeout(2000) });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        if (response.status === 401 && session.status === "authenticated") {
          console.error("Cart API rejected a browser session reported as authenticated:", error?.message);
        } else if (response.status !== 401) {
          console.error("Cart request failed:", response.status, error?.message || response.statusText);
        }
        SetCartData(null);
        return;
      }
      const data: CartResponce = await response.json();

      if (data?.data?.cartOwner) {
        localStorage.setItem("userId", data.data.cartOwner);
      }

      SetCartData(data);
    } catch (err) {
      console.error("Cart request could not reach the server:", err);
      SetCartData(null);
    }
  }

  async function getWishlist() {
    try {
      const response = await fetch("/api/get-seshlist", { credentials: "same-origin", cache: "no-store", signal: AbortSignal.timeout(2000) });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        if (response.status === 401 && session.status === "authenticated") {
          console.error("Wishlist API rejected a browser session reported as authenticated:", error?.message);
        } else if (response.status !== 401) {
          console.error("Wishlist request failed:", response.status, error?.message || response.statusText);
        }
        SetWishlist(null);
        return;
      }
      const data: WishlistResponse = await response.json();

      SetWishlist(data);
    } catch (err) {
      console.error("Wishlist request could not reach the server:", err);
      SetWishlist(null);
    }
  }

  useEffect(() => {
    let active = true;
    async function loadUserLists() {
      SetLoading(true);
      if (session.status !== "authenticated") {
        SetCartData(null);
        SetWishlist(null);
        if (typeof window !== "undefined") localStorage.removeItem("userId");
        SetLoading(false);
        return;
      }
      await Promise.all([getCart(), getWishlist()]);
      if (active) SetLoading(false);
    }
    if (session.status !== "loading") void loadUserLists();
    return () => { active = false; };
  }, [session.status]);

  return (
    <cartContext.Provider
      value={{
        cartData,
        SetCartData,
        loading,
        SetLoading,
        getCart,
        wishlistData,
        SetWishlist,
        getWishlist,
      }}
    >
      {children}
    </cartContext.Provider>
  );
}
