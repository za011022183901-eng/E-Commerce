import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import GetCartContext from "@/components/context/CartContext";
import MySassion from "@/components/mySession/MySassion";
import PageExperience from "@/components/PageExperience/PageExperience";

export const metadata: Metadata = {
  title: { default: "ShopMart | Find your next favorite", template: "%s | ShopMart" },
  description: "Discover technology, fashion, beauty and everyday essentials at ShopMart.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className="min-h-screen font-sans antialiased" suppressHydrationWarning><MySassion><GetCartContext><Navbar /><div className="min-h-screen"><Toaster position="top-center" toastOptions={{ duration: 3500 }} /><PageExperience>{children}</PageExperience></div><Footer /></GetCartContext></MySassion></body></html>;
}
