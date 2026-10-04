"use client";

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
  return <>{children}</>;
}
