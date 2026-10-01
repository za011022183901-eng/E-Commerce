"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

const titles: Record<string, string> = {
  "/": "ShopMart | Find your next favorite", "/products": "Explore products", "/categories": "Shop by category", "/brands": "Discover brands", "/card": "Your shopping bag", "/Wishlist": "Your wishlist", "/login": "Welcome back", "/register": "Create your account", "/forgot-password": "Reset your password", "/verify-reset-code": "Verify reset code", "/reset-password": "Choose a new password", "/profile/accountUser": "Your account", "/profile/allorders": "Your orders",
};

function titleFor(pathname: string) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/products/")) return "Product details | ShopMart";
  if (pathname.startsWith("/categories/")) return "Category collection | ShopMart";
  if (pathname.startsWith("/brands/")) return "Brand collection | ShopMart";
  return "ShopMart";
}

export default function PageExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const pageTitle = titleFor(pathname);
    document.title = pageTitle;
    const settleTitle = window.setTimeout(() => { document.title = pageTitle; }, 250);
    return () => window.clearTimeout(settleTitle);
  }, [pathname]);
  return <AnimatePresence mode="wait" initial={false}><motion.div key={pathname} initial={{ opacity: 0, y: 14, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(3px)" }} transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div></AnimatePresence>;
}
