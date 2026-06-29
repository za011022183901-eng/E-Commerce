"use client";

import { use, useContext, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, ShoppingCartIcon } from "lucide-react";
import toast from "react-hot-toast";
import { cartContext } from "../context/CartContext";
import { addToCardAction } from "@/app/(pages)/products/_action/addToCardAction";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddToCart({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, Setloading] = useState(false);
  const { getCart, SetCartData } = useContext(cartContext);
  const session = useSession();

  async function addProductCard() {
    if (session.status === "authenticated") {
      Setloading(true);

      const data = await addToCardAction(productId);

      SetCartData(data);

      Setloading(false);
      getCart()


      if (data.status === "success") toast.success(data.message);
      else toast.error(data?.message || "Error");
    } else {
      toast.error("Please login to add products to cart"); // ✅ toast هنا
      router.push("/login"); // redirect للصفحة login
    }
  }

  return (
    <Button
      disabled={loading}
      onClick={addProductCard}
      className="flex items-center justify-center gap-2 flex-grow bg-green-500 hover:bg-green-600 transition text-white rounded-xl shadow-md cursor-cell"
    >
      {loading ? <Loader2 className="animate-spin" /> : <ShoppingCartIcon />} Add to Cart
    </Button>
  );
}
