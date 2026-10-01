"use client";

import React, { useContext, useRef, useState } from "react";
import { formatCurrency } from "@/Helpers/format";
import { cartContext } from "@/components/context/CartContext";
import Loading from "@/components/Loadingg/page";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import CeckOut from "@/components/CeckOut/CeckOut";

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

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-lg font-semibold">{formatCurrency(product.price)}</div>

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
