"use client";
import { cartContext } from "@/components/context/CartContext";
import Loading from "@/components/Loadingg/page";
import React, { useContext } from "react";
import Link from "next/link";
import AddAndRemoveWishlist from "@/components/AddAndRemoveWishlist/page";
import AddToCart from "@/components/AddToCard/AdToCard";
import { motion } from "framer-motion";
import ProductImage from "@/components/ProductImage/ProductImage";

export default function CartItem() {
  const { wishlistData, loading } = useContext(cartContext);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 pb-8 pt-28 sm:pt-32">
      {/* حالة القائمة مليانة */}
      {(wishlistData?.count ?? 0) > 0 ? (
        <>
          <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className="mb-8 text-left max-w-[1100px] mx-auto">
            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 break-words sm:text-4xl md:text-5xl">
              <motion.span initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: [0, 2, 0] }} transition={{ opacity: { duration: .35 }, x: { duration: 2.4, repeat: Infinity, repeatDelay: .25, ease: "easeInOut" } }} className="inline-block">Your</motion.span>{" "}
              <motion.span initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: [0, -2, 0], backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ opacity: { duration: .35, delay: .12 }, x: { duration: 2.4, delay: .12, repeat: Infinity, repeatDelay: .25, ease: "easeInOut" }, backgroundPosition: { duration: 3.5, repeat: Infinity, ease: "linear" } }} className="inline-block bg-gradient-to-r from-emerald-700 via-teal-400 to-cyan-600 bg-[length:200%_auto] bg-clip-text text-transparent">Wishlist</motion.span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.38, ease: "easeOut" }} className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3.5 py-1.5 text-sm text-gray-600 shadow-sm">
              <motion.span initial={{ scale: .4, rotate: -12 }} animate={{ scale: [1, 1.08, 1], rotate: 0 }} transition={{ scale: { duration: 2.2, repeat: Infinity, repeatDelay: .3 }, rotate: { type: "spring", stiffness: 300, damping: 12, delay: .55 } }} className="font-bold text-emerald-700">{wishlistData?.count || 0}</motion.span>
              <span className="inline-flex gap-1"><span>item(s)</span><span>in your wishlist</span></span>
            </motion.p>
          </motion.header>

          <div className="flex flex-col gap-6 items-center">
            {wishlistData?.data?.map((item: any) => (
              <div
                key={item._id}
                className="border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-stretch sm:items-center shadow-md bg-white w-full max-w-[1100px] min-w-0 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  <ProductImage
                    src={item.imageCover}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="rounded-md w-20 h-20 sm:w-[120px] sm:h-[120px] object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold break-words [overflow-wrap:anywhere]">{item.title}</h2>
                    <p className="text-gray-500 text-sm break-words [overflow-wrap:anywhere]">{item.brand?.name}</p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 min-w-0">
                  <span className="font-semibold text-gray-800 text-base sm:text-lg break-words [overflow-wrap:anywhere] dark:text-white">
                    EGP {item.price}
                  </span>
                  <div className="flex items-center justify-end gap-3 flex-wrap">
                    <AddAndRemoveWishlist productId={item._id} />
                    <AddToCart productId={item._id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* حالة القائمة فاضية */
        <div className="flex flex-col justify-center items-center min-h-[60vh] w-full mx-auto space-y-4 text-center">
          <p className="text-gray-700 font-semibold text-lg">
            Your wishlist is empty 💔 
            <br />
            Go to the products page and add your favorite items!
          </p>
          <Link
            href="/products"
            className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
          >
            Go to Products ❤️
          </Link>
        </div>
      )}
    </div>
  );
}
