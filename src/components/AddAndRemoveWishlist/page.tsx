"use client";
import React, { useState, useContext, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { cartContext } from "@/components/context/CartContext";
import { useSession } from "next-auth/react";

export default function Whilshit({ productId }: { productId: string }) {
  const { cartData, wishlistData, getWishlist } = useContext(cartContext);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if product is in wishlist from context data
  const isInWishlist = wishlistData?.data?.some(
    (product) => product._id === productId || product.id === productId
  ) || false;

  // Update liked state based on wishlist data and session status
  useEffect(() => {
    if (status === "authenticated") {
      setLiked(isInWishlist);
    } else {
      // Clear liked state when user logs out
      setLiked(false);
    }
  }, [isInWishlist, status]);

  async function toggleWishlist() {
    // Wait until NextAuth has checked the browser's session cookie before
    // deciding that the visitor needs to sign in.
    if (status === "loading") return;

    if (status === "unauthenticated") {
      toast.error("Please login to manage your wishlist");
      router.push("/login"); // 🔹 Redirect للصفحة login
      return;
    }

    setLoading(true);
    try {
      if (!liked) {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        const data = await response.json();
        if (response.status === 401) {
          toast.error("Your login session expired. Please sign in again.");
          router.push("/login");
          return;
        }

        if (data.status === "success") {
          setLiked(true);
          toast.success("Added to your wishlist ❤️");
        } else {
          toast.error(data?.message || "Error");
        }

      } else {
        const response = await fetch(`/api/wishlist/${encodeURIComponent(productId)}`, {
          method: "DELETE",
          credentials: "same-origin",
          cache: "no-store",
        });
        const data = await response.json();
        if (response.status === 401) {
          toast.error("Your login session expired. Please sign in again.");
          router.push("/login");
          return;
        }

        if (data.status === "success") {
          setLiked(false);
          toast.success("Removed from your wishlist 💔");
        } else {
          toast.error(data?.message || "Error");
        }
      }
    } catch {
      toast.error("Connection error!");
    } finally {
      setLoading(false);
      await getWishlist();
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading || status === "loading"}
      className="flex items-center justify-center"
    >
      {loading || status === "loading" ? (
        <Loader2 className="animate-spin text-pink-600" />
      ) : (
        <Heart
          className={`size-6 transition-all cursor-pointer ${
            liked && status === "authenticated"
              ? "text-red-500 fill-red-500"
              : "text-gray-500 hover:text-red-400"
          }`}
        />
      )}
    </button>
  );
}
