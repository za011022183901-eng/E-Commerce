"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Heart, ListOrdered, Menu, X, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen relative bg-slate-50 dark:bg-[#0B0F17] transition-colors duration-300">
      {/* ====== Sidebar ====== */}
      <motion.aside
        animate={{ width: open ? 220 : 80 }}
        className="fixed top-0 bottom-0 left-0 z-20 flex h-auto min-h-screen flex-col items-center overflow-y-auto rounded-r-2xl bg-gradient-to-b from-emerald-600 via-teal-600 to-emerald-700 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 border-r border-transparent dark:border-slate-800/80 p-4 pt-28 text-white transition-all duration-300"
      >
        {/* زر الفتح/القفل */}
        <motion.button
          onClick={() => setOpen(!open)}
          animate={{
            alignSelf: open ? "flex-end" : "center",
          }}
          aria-label={open ? "Close profile menu" : "Open profile menu"}
          className="relative right-0 cursor-pointer text-white transition-all duration-300"
        >
          <div className="flex items-center justify-center rounded-xl bg-white/20 dark:bg-slate-800/60 p-2 shadow-md hover:bg-white/30 dark:hover:bg-slate-700/80 backdrop-blur-md">
            {open ? <X /> : <Menu />}
          </div>
        </motion.button>

        {/* روابط المنيو */}
        <nav className="relative mt-8 flex w-full flex-1 flex-col gap-3">
          {/* خيار اذهب للتسوق الأوّل */}
          <Link 
            onClick={() => setOpen(false)}
            href="/products"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 dark:hover:bg-emerald-500/20 ${pathname === "/products" ? "bg-white/20 dark:bg-emerald-500/25 font-bold" : ""}`}
          >
            <ShoppingBag size={22} />
            {open && <span>Go to Shopping</span>}
          </Link>

          <Link 
            onClick={() => setOpen(false)}
            href="/"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 dark:hover:bg-emerald-500/20 ${pathname === "/" ? "bg-white/20 dark:bg-emerald-500/25 font-bold" : ""}`}
          >
            <Home size={22} />
            {open && <span>Home</span>}
          </Link>

          <Link 
            onClick={() => setOpen(false)}
            href="/profile/allorders"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 dark:hover:bg-emerald-500/20 ${pathname.endsWith("/allorders") ? "bg-white/20 dark:bg-emerald-500/25 font-bold" : ""}`}
          >
            <ListOrdered size={22} />
            {open && <span>All Orders</span>}
          </Link>

          <Link 
            onClick={() => setOpen(false)}
            href="/card"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 dark:hover:bg-emerald-500/20 ${pathname === "/card" ? "bg-white/20 dark:bg-emerald-500/25 font-bold" : ""}`}
          >
            <ShoppingCart size={22} />
            {open && <span>Cart</span>}
          </Link>

          <Link 
            onClick={() => setOpen(false)}
            href="/Wishlist"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 dark:hover:bg-emerald-500/20 ${pathname === "/Wishlist" ? "bg-white/20 dark:bg-emerald-500/25 font-bold" : ""}`}
          >
            <Heart size={22} />
            {open && <span>Wishlist</span>}
          </Link>
        </nav>
      </motion.aside>

      {/* ====== Overlay لما المنيو مفتوحة ====== */}
      {open && (
        <div 
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-slate-900/30 dark:bg-black/60 backdrop-blur-sm z-10 transition-all duration-300"
        />
      )}

      {/* ====== Main Content ====== */}
      <main
        className={`min-h-screen flex-1 bg-white dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-all duration-300 ${
          open ? "ml-[220px]" : "ml-[80px]"
        } relative z-0`}
      >
        {children}
      </main>
    </div>
  );
}