"use client";

import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, ShoppingCartIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cartContext } from "../context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddToCart({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, Setloading] = useState(false);
  const { getCart } = useContext(cartContext);
  const session = useSession();

  async function addProductCard() {
    // SessionProvider can take a moment to restore the cookie-backed session,
    // especially on a slower browser startup. Never treat "loading" as guest.
    if (session.status === "loading") return;

    if (session.status === "authenticated") {
      Setloading(true);
      try {
        const response = await fetch("/api/cart", {
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
          toast.success(data.message || "Product added to cart");
          await getCart();
        } else {
          toast.error(data?.message || "Error adding product to cart");
        }
      } catch {
        toast.error("Could not add product to cart. Please try again.");
      } finally {
        Setloading(false);
      }
    } else {
      toast.error("Please login to add products to cart"); // ✅ toast هنا
      router.push("/login"); // redirect للصفحة login
    }
  }

  return (
    <Button
      disabled={loading || session.status === "loading"}
      onClick={addProductCard}
      className="flex items-center justify-center gap-2 flex-grow bg-green-500 hover:bg-green-600 transition text-white rounded-xl shadow-md cursor-cell"
    >
      {loading || session.status === "loading" ? <Loader2 className="animate-spin" /> : <ShoppingCartIcon />} Add to Cart
    </Button>
  );
}
