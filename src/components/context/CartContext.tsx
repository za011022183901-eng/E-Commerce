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
      const response = await fetch("/api/get-cart");
      const data: CartResponce = await response.json();

      if (data?.data?.cartOwner) {
        localStorage.setItem("userId", data.data.cartOwner);
      }

      SetCartData(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      SetCartData(null);
    } finally {
      SetLoading(false);
    }
  }

  async function getWishlist() {
    try {
      const response = await fetch("/api/get-seshlist");
      const data: WishlistResponse = await response.json();

      SetWishlist(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      SetWishlist(null);
    } finally {
      SetLoading(false);
    }
  }

  useEffect(() => {
     {
      getCart();
      getWishlist();
    }
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
