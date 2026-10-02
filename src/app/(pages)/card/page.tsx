"use client";

import React, { useContext, useRef, useState } from "react";
import { formatCurrency } from "@/Helpers/format";
import { cartContext } from "@/components/context/CartContext";
import Loading from "@/components/Loadingg/page";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import CeckOut from "@/components/CeckOut/CeckOut";
import { motion } from "framer-motion";

export default function ShoppingCart() {
  const { cartData, loading, getCart, SetCartData } = useContext(cartContext);
  const [loadingId, setLoadingId] = useState<null | string>(null);
  const [updatId, setUpdatId] = useState<null | string>(null);
  const [clearLoading, setClearLoading] = useState<boolean>(false);
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({});
  const updatingProducts = useRef(new Set<string>());

  async function deleteCard(cardId: string) {
    try {
      setLoadingId(cardId);
      const response = await fetch(`/api/cart/${encodeURIComponent(cardId)}`, {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to remove product");
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
    if (!Number.isInteger(count) || count < 1 || updatingProducts.current.size > 0) return;
    const currentCart = cartData;
    const currentItem = currentCart?.data.products.find((item) => item.product._id === productId);
    if (!currentCart || !currentItem) return;
    if (currentItem.count === count) {
      setQuantityDrafts((drafts) => ({ ...drafts, [productId]: String(count) }));
      return;
    }

    updatingProducts.current.add(productId);
    setUpdatId(productId);
    const optimisticProducts = currentCart.data.products.map((item) =>
      item.product._id === productId ? { ...item, count } : item
    );
    SetCartData({
      ...currentCart,
      numOfCartItems: currentCart.numOfCartItems + count - currentItem.count,
      data: {
        ...currentCart.data,
        products: optimisticProducts,
        totalCartPrice: optimisticProducts.reduce((total, item) => total + item.price * item.count, 0),
      },
    });
    try {
      const response = await fetch(`/api/cart/${encodeURIComponent(productId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update cart");
      if (data.status === "success") {
        SetCartData(data);
        setQuantityDrafts((drafts) => ({ ...drafts, [productId]: String(count) }));
      } else {
        SetCartData(currentCart);
        setQuantityDrafts((drafts) => ({ ...drafts, [productId]: String(currentItem.count) }));
        toast.error(data.message || "Failed to update cart");
      }
    } catch (error: any) {
      SetCartData(currentCart);
      setQuantityDrafts((drafts) => ({ ...drafts, [productId]: String(currentItem.count) }));
      toast.error(error.message || "Something went wrong");
    } finally {
      updatingProducts.current.delete(productId);
      setUpdatId(null);
    }
  }

  function updateQuantityInput(productId: string, value: string) {
    if (!/^\d*$/.test(value)) return;
    setQuantityDrafts((drafts) => ({ ...drafts, [productId]: value }));
  }

  function saveQuantityInput(productId: string, currentCount: number) {
    const rawValue = quantityDrafts[productId] ?? String(currentCount);
    const count = Number(rawValue);
    if (!rawValue || !Number.isInteger(count) || count < 1) {
      setQuantityDrafts((drafts) => ({ ...drafts, [productId]: String(currentCount) }));
      return;
    }
    void updatCard(productId, count);
  }

  async function clearCard() {
    setClearLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to clear cart");
      if (data.status === "success") {
        SetCartData(data);
        toast("All cart items removed successfully", { icon: "🗑️" });
      } else {
        toast.error(data.message || "Failed to clear cart");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setClearLoading(false);
      await getCart();
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : cartData?.numOfCartItems! > 0 ? (
        <div className="px-3 sm:px-6 md:px-12 lg:px-20 pb-8 pt-28 sm:pt-32 md:pb-41">
          <div className="max-w-9xl mx-auto">
            <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }} className="mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
                <motion.span initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: [0, 2, 0] }} transition={{ opacity: { duration: .35 }, x: { duration: 2.4, repeat: Infinity, repeatDelay: .25, ease: "easeInOut" } }} className="inline-block">Shopping</motion.span>{" "}
                <motion.span initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: [0, -2, 0], backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ opacity: { duration: .35, delay: .12 }, x: { duration: 2.4, delay: .12, repeat: Infinity, repeatDelay: .25, ease: "easeInOut" }, backgroundPosition: { duration: 3.5, repeat: Infinity, ease: "linear" } }} className="inline-block bg-gradient-to-r from-emerald-700 via-teal-400 to-cyan-600 bg-[length:200%_auto] bg-clip-text text-transparent">Cart</motion.span>
              </h1>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .3, ease: "easeOut" }} className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-1.5 text-sm text-gray-600 shadow-sm">
                <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: .3 }} className="font-bold text-emerald-700">{cartData?.numOfCartItems}</motion.span>
                <span>item(s) in your cart</span>
              </motion.p>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                {cartData?.data.products.map((product) => (
                  <div key={product._id} className={`flex flex-wrap items-center gap-4 sm:gap-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm relative min-w-0 ${updatId === product.product._id ? "opacity-50 pointer-events-none" : ""}`}>
                    <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                      {product.product?.imageCover ? (
                        <img src={product.product.imageCover} alt={product.product.title || "Product"} className="object-cover w-full h-full" />
                      ) : (
                        <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
                          <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold break-words [overflow-wrap:anywhere]">{product.product.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 break-words [overflow-wrap:anywhere]">
                        {product.product.brand?.name || "No Brand"} · {product.product.category?.name || "No Category"}
                      </p>

                      <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          disabled={product.count === 1 || updatId !== null}
                          onClick={() => updatCard(product.product._id, product.count - 1)}
                          className="h-8 w-8 cursor-pointer rounded-md border border-gray-200 bg-white flex items-center justify-center text-lg"
                        >
                          −
                        </button>

                        <input
                          aria-label={`Quantity for ${product.product.title}`}
                          type="number"
                          min={1}
                          step={1}
                          inputMode="numeric"
                          value={quantityDrafts[product.product._id] ?? String(product.count)}
                          onChange={(event) => updateQuantityInput(product.product._id, event.target.value)}
                          onBlur={() => saveQuantityInput(product.product._id, product.count)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") event.currentTarget.blur();
                          }}
                          disabled={updatId !== null}
                          className="h-9 w-16 rounded-md border border-gray-200 text-center text-sm font-semibold outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:opacity-60"
                        />

                        <button
                          type="button"
                          disabled={updatId !== null}
                          onClick={() => updatCard(product.product._id, product.count + 1)}
                          className="h-8 w-8 cursor-pointer rounded-md border border-gray-200 bg-white flex items-center justify-center text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex w-full sm:w-auto flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 min-w-0">
                      <div className="text-base sm:text-lg font-semibold break-words [overflow-wrap:anywhere]">{formatCurrency(product.price)}</div>

                      <button
                        type="button"
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
                  type="button"
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
