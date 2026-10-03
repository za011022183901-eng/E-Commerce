"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { products as Product } from "@/interfaces/products";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddToCart from "@/components/AddToCard/AdToCard";
import AddAndRemoveWishlist from "@/components/AddAndRemoveWishlist/page";
import { StarIcon, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useParams } from "next/navigation";

export default function CategoryDetails() {
  const params = useParams();
  const categories = params?.categories as string;

  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categories) return;
    async function fetchProducts() {
      try {
        const response = await fetch(
          `https://ecommerce.routemisr.com/api/v1/products?category=${categories}`
        );
        const payload = response.ok ? await response.json() : null;
        setCategoryProducts(Array.isArray(payload?.data) ? payload.data : []);
      } catch (error) {
        setCategoryProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categories]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<StarIcon key={i} className="text-yellow-500 w-4 h-4 fill-yellow-500 drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]" />);
      } else {
        stars.push(<StarIcon key={i} className="text-gray-200 w-4 h-4 fill-gray-200" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-white">
        <Sparkles className="w-10 h-10 animate-spin text-green-500" />
      </div>
    );
  }

  if (categoryProducts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-white text-gray-900 space-y-4 px-4 text-center">
        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center border border-green-100 shadow-sm mb-2">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-gray-800 font-extrabold text-xl tracking-tight">
          No products found for this category
        </p>
        <p className="text-gray-400 text-sm max-w-sm">
          We couldn't find any items in this collection right now. Check back later or explore other sections.
        </p>
        <Link
          href="/categories"
          className="px-6 py-2.5 bg-green-500 text-white rounded-full font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all duration-300"
        >
          Go back to categories
        </Link>
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white text-gray-900 overflow-hidden container mx-auto mt-24 px-4 pb-24">
      {/* خلفية تجميلية متحركة */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-green-500/10 via-emerald-500/5 to-transparent blur-[100px] rounded-full pointer-events-none -z-10"
      />

      {/* عنوان الصفحة */}
      <div className="mb-16 text-center relative py-6">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm"
        >
          <Sparkles className="w-4 h-4 animate-spin text-green-500" />
          <span>Exclusive Collection</span>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
        >
          Explore Category Products
        </motion.h2>
        <p className="text-gray-400 text-sm mt-2 font-medium">Discover top-tier items crafted and handpicked for you.</p>
      </div>

      {/* شبكة المنتجات بالأنيميشن */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {categoryProducts.map((product) => (
          <motion.div key={product._id} variants={itemVariants} className="flex">
            <motion.div
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col justify-between w-full rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-500/50 transition-all overflow-hidden"
            >
              <Card className="border-0 shadow-none flex flex-col justify-between h-full bg-transparent">
                {/* صورة المنتج */}
                <div className="relative overflow-hidden bg-gray-50/70 p-6 h-64 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative flex items-center justify-center"
                  >
                    <Link href={"/products/" + product._id} className="w-full h-full block">
                      <img
                        src={product.imageCover}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-md"
                      />
                    </Link>
                  </motion.div>

                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-white/95 backdrop-blur-md text-gray-700 px-3 py-1 rounded-full shadow-sm border border-gray-100">
                    {product.category?.name}
                  </span>
                </div>

                {/* التفاصيل */}
                <CardHeader className="p-5 pb-2">
                  <span className="text-xs font-bold text-green-600 tracking-wider uppercase">
                    {product.brand?.name || "Brand"}
                  </span>
                  <CardTitle className="text-base font-bold text-gray-800 line-clamp-1 mt-0.5">
                    {product.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-5 pb-4 pt-0">
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
                      <p className="font-black text-gray-950 text-xl tracking-tight dark:text-white">
                        {product.price} <span className="text-xs text-green-500 font-extrabold dark:text-white">EGP</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.ratingsAverage)}
                    </div>
                  </div>
                </CardContent>

                {/* الأزرار (زر إضافة للسلة بحجم كبير وبارز وزر الويشليست) */}
                <CardFooter className="p-5 pt-0 flex items-center gap-3">
                  <div className="flex-1 [&>button]:w-full [&>div]:w-full">
                    <AddToCart productId={product._id} />
                  </div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                    <AddAndRemoveWishlist productId={product._id} />
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
