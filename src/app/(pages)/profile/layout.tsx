"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Heart, ListOrdered, Menu, X } from "lucide-react";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative ">
      {/* ====== Sidebar ====== */}
      <motion.aside
        animate={{ width: open ? 200 : 70 }}
        className="fixed top-0 left-0 min-h-screen bg-gradient-to-b from-green-600 to-green-400 
                   text-white p-4 flex flex-col items-center space-y-6 transition-all duration-300 z-20 rounded-r-2xl"
      >
        {/* زر الفتح/القفل */}
        <motion.button
          onClick={() => setOpen(!open)}
          animate={{
            alignSelf: open ? "flex-end" : "center",
          }}
          className="self-end mb-4 relative right-0 cursor-pointer my-20 text-white transition-all duration-300"
        >
          <div className="bg-white/20 hover:bg-white/30 p-2 mt-24 rounded-xl shadow-md flex items-center justify-center">
            {open ? <X /> : <Menu />}
          </div>
        </motion.button>

        {/* روابط المنيو */}
        <nav
          className={`flex flex-col my-10 space-y-4 w-full transition-all duration-300 relative  ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-60"
          }`}
        >
          <Link onClick={() => setOpen(false)}
            href="/"
            className="flex items-center gap-3 hover:bg-green-300 p-2 rounded-md transition-colors"
          >
            <Home size={20} />
            {open && <span>Home</span>}
          </Link>

          <Link onClick={() => setOpen(false)}
            href="/allorders"
            className="flex items-center gap-3 hover:bg-green-300 p-2 rounded-md transition-colors"
          >
            <ListOrdered size={20} />
            {open && <span>All Orders</span>}
          </Link>

          <Link onClick={() => setOpen(false)}
            href="/card"
            className="flex items-center gap-3 hover:bg-green-300 p-2 rounded-md transition-colors"
          >
            <ShoppingCart size={20} />
            {open && <span>Cart</span>}
          </Link>

          <Link onClick={() => setOpen(false)}
            href="/Wishlist"
            className="flex items-center gap-3 hover:bg-green-300 p-2 rounded-md transition-colors"
          >
            <Heart size={20} />
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
        className={`flex-1 bg-white transition-all duration-300 min-h-screen ${
          open ? "ml-[200px]" : "ml-[70px]"
        } relative z-0`}
      >
        {children}
      </main>
    </div>
  );
}
