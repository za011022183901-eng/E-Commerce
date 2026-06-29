"use client";

import React, { useEffect, useContext, useState } from "react";
import { formatCurrency } from "@/Helpers/format";
import { cartContext } from "@/components/context/CartContext";
import Loading from "@/components/Loadingg/page";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import CeckOut from "@/components/CeckOut/CeckOut";
import { addToCardAction2, deleteCard2, clearCard2 } from "./_action/cartApi.action";

export default function ShoppingCart() {
  const { cartData, loading, getCart, SetCartData } = useContext(cartContext);
  const [loadingId, setLoadingId] = useState<null | string>(null);
  const [updatId, setUpdatId] = useState<null | string>(null);
  const [clearLoading, setClearLoading] = useState<boolean>(false);

  async function deleteCard(cardId: string) {
    try {
      setLoadingId(cardId);
      const data = await deleteCard2(cardId);
      if (data.status === "success") {
        SetCartData(data);
        toast("Product removed successfully", { icon: "🗑️" });
      } else {
        toast.error(data.message || "Failed to remove product");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setLoadingId(null);
    }
  }

  async function updatCard(productId: string, count: number) {
    setUpdatId(productId);
    try {
      const data = await addToCardAction2(productId, count);
      if (data.status === "success") {
        SetCartData(data);
        toast("Product quantity updated", { icon: "✅" });
      } else {
        toast.error(data.message || "Failed to update cart");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdatId(null);
    }
  }

  async function clearCard() {
    setClearLoading(true);
    SetCartData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const data = await clearCard2();
      toast("All cart items removed successfully", { icon: "🗑️" });
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setClearLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : cartData?.numOfCartItems! > 0 ? (
        <div className="px-6 md:px-12 lg:px-20 py-10 md:py-20 md:pb-41">
          <div className="max-w-9xl mx-auto">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight my-14">Shopping Cart</h1>
              <p className="text-gray-500 mt-2">{cartData?.numOfCartItems} item(s) in your cart</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                {cartData?.data.products.map((product) => (
                  <div key={product._id} className={`flex items-center gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm relative ${updatId === product.product._id ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {product.product?.imageCover ? (
                        <img src={product.product.imageCover} alt={product.product.title || "Product"} className="object-cover w-full h-full" />
                      ) : (
                        <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
                          <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{product.product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.product.brand?.name || "No Brand"} · {product.product.category?.name || "No Category"}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <button
                          disabled={product.count === 1}
                          onClick={() => updatCard(product.product._id, product.count - 1)}
                          className="h-8 w-8 cursor-pointer rounded-md border border-gray-200 bg-white flex items-center justify-center text-lg"
                        >
                          −
                        </button>

                        <div className="min-w-[28px] text-center text-sm flex items-center justify-center">
                          {updatId === product.product._id ? <Loader2 className="animate-spin text-green-500" /> : product.count}
                        </div>

                        <button
                          onClick={() => updatCard(product.product._id, product.count + 1)}
                          className="h-8 w-8 cursor-pointer rounded-md border border-gray-200 bg-white flex items-center justify-center text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>

                      <button
                        onClick={() => deleteCard(product.product._id)}
                        className="text-sm text-red-500 cursor-pointer font-medium px-3 py-1.5 rounded-md transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-md"
                      >
                        {loadingId === product.product._id ? <Loader2 className="animate-spin" /> : <p>Remove</p>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-36 h-fit">
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

                <div className="flex items-center justify-between text-gray-600 py-2">
                  <span className="text-sm">Items</span>
                  <span className="font-medium">{cartData?.numOfCartItems}</span>
                </div>

                <div className="flex items-center justify-between text-gray-600 py-2">
                  <span className="text-sm">Shipping</span>
                  <span className="font-medium text-green-500">Free</span>
                </div>

                <div className="border-t border-gray-100 my-4" />

                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-extrabold">{formatCurrency(cartData?.data.totalCartPrice!)}</span>
                </div>

                <CeckOut cartId={cartData?.cartId!} />

                <button className="mt-3 w-full cursor-pointer py-3 rounded-3xl border border-gray-200 text-gray-700 font-medium bg-white hover:bg-gray-50">
                  Continue Shopping
                </button>

                <button
                  onClick={clearCard}
                  className="mt-4 w-full cursor-pointer py-3 rounded-3xl border border-red-200 text-red-500 font-medium bg-white shadow-md transition-all duration-300 hover:bg-red-600 hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500">
                    {clearLoading ? <Loader2 className="animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </span>
                  <span className="tracking-wide text-sm sm:text-base">Remove ALL CART</span>
                </button>
              </aside>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen w-full mx-auto space-y-4 text-center">
          <p className="text-gray-700 font-semibold text-lg">
            Your shopping cart doesn’t contain any items yet. Start adding products to see them here!
          </p>
          <Link href="/products" className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition">
            Go back to products
          </Link>
        </div>
      )}
    </>
  );
}
