"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Heart, ListOrdered, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen relative ">
      {/* ====== Sidebar ====== */}
      <motion.aside
        animate={{ width: open ? 220 : 80 }}
        className="fixed top-0 bottom-0 left-0 z-20 flex h-auto min-h-screen flex-col items-center overflow-y-auto rounded-r-2xl bg-gradient-to-b from-green-600 to-green-400 p-4 pt-28 text-white transition-all duration-300"
      >
        {/* زر الفتح/القفل */}
        <motion.button
          onClick={() => setOpen(!open)}
          animate={{
            alignSelf: open ? "flex-end" : "center",
          }}
          aria-label={open ? "Close profile menu" : "Open profile menu"}
          className="relative right-0 cursor-pointer self-end text-white transition-all duration-300"
        >
          <div className="flex items-center justify-center rounded-xl bg-white/20 p-2 shadow-md hover:bg-white/30">
            {open ? <X /> : <Menu />}
          </div>
        </motion.button>

        {/* روابط المنيو */}
        <nav
          className="relative mt-8 flex w-full flex-1 flex-col gap-3"
        >
          <Link onClick={() => setOpen(false)}
            href="/"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 ${pathname === "/" ? "bg-white/20" : ""}`}
          >
            <Home size={22} />
            {open && <span>Home</span>}
          </Link>

          <Link onClick={() => setOpen(false)}
            href="/profile/allorders"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 ${pathname.endsWith("/allorders") ? "bg-white/20" : ""}`}
          >
            <ListOrdered size={22} />
            {open && <span>All Orders</span>}
          </Link>

          <Link onClick={() => setOpen(false)}
            href="/card"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 ${pathname === "/card" ? "bg-white/20" : ""}`}
          >
            <ShoppingCart size={22} />
            {open && <span>Cart</span>}
          </Link>

          <Link onClick={() => setOpen(false)}
            href="/Wishlist"
            className={`flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/20 ${pathname === "/Wishlist" ? "bg-white/20" : ""}`}
          >
            <Heart size={22} />
            {open && <span>Wishlist</span>}
          </Link>

        </nav>
      </motion.aside>

      {/* ====== Overlay لما المنيو مفتوحة ====== */}
      {open && (
        <div className="fixed inset-0 bg-white/15 backdrop-blur-sm z-10 transition-all duration-300"></div>
      )}

      {/* ====== Main Content ====== */}
      <main
        className={`min-h-screen flex-1 bg-white transition-all duration-300 ${
          open ? "ml-[220px]" : "ml-[80px]"
        } relative z-0`}
      >
        {children}
      </main>
    </div>
  );
}
