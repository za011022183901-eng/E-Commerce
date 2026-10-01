"use client"; // يجب جعل المكون Client Component لاستخدام Framer Motion

import Link from "next/link";
import { products as ProductsType } from '@/interfaces/products';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddToCart from "@/components/AddToCard/AdToCard";
import AddAndRemoveWishlist from "@/components/AddAndRemoveWishlist/page";
import { StarIcon } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export const dynamic = "force-dynamic";

export default function Products() {
  const [products, setProducts] = React.useState<ProductsType[]>([]);
  const [loading, setLoading] = React.useState(true);

  // جلب البيانات في Client Component
  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://ecommerce.routemisr.com/api/v1/products");
        const { data }: { data: ProductsType[] } = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // دالة طباعة النجوم ديناميكياً
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<StarIcon key={i} className="text-yellow-500 w-4 h-4 fill-yellow-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative inline-block">
            <StarIcon className="text-gray-200 w-4 h-4 fill-gray-200" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden h-full">
              <StarIcon className="text-yellow-500 w-4 h-4 fill-yellow-500" />
            </div>
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="text-gray-200 w-4 h-4 fill-gray-200" />);
      }
    }
    return stars;
  };

  // إعدادات الحركة للظهور المتتابع
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // زمن التأخير بين كل بطاقة
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="container mx-auto mt-24 px-4">
      {/* ===== قسم العنوان مع تأثير Marquee ===== */}
      <div className="mb-12 text-center md:text-left overflow-hidden py-2">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative whitespace-nowrap"
        >
          {/* النص الأول يتحرك لليمين */}
          <motion.h2
            animate={{ x: [0, 50, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="text-6xl font-extrabold text-gray-900 tracking-tighter"
          >
            Our <span className="text-green-500">Products</span>
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative whitespace-nowrap mt-3"
        >
          {/* النص الثاني يتحرك لليسار */}
          <motion.p
            animate={{ x: [0, -50, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="text-gray-500 text-lg font-medium"
          >
            Explore our latest trends and best sellers
          </motion.p>
        </motion.div>
      </div>

      {/* ===== شبكة المنتجات مع أنيميشن الظهور ===== */}
      <AnimatePresence>
        {loading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
          </div>
        ) : (
          <motion.div
            className="flex flex-wrap items-stretch -m-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products?.map((product) => (
              <motion.div
                key={product._id}
                className="product-card p-3 flex w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 group"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }} // تأثير عند التمرير بالماوس
              >
                <Card className="flex flex-col justify-between w-full rounded-2xl bg-white border border-gray-100 transition-all duration-500 ease-out relative overflow-hidden shadow-sm hover:shadow-green-500/5 hover:shadow-2xl hover:border-green-500">
                  {/* ===== صورة المنتج مع تأثير الهوفر ===== */}
                  <div className="relative overflow-hidden bg-gray-50/50 rounded-t-2xl p-4 flex items-center justify-center h-64">
                    <Link href={"/products/" + product.id} className="w-full h-full block relative">
                      <img
                        src={product.imageCover}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* شارة القسم */}
                    <span className="absolute top-3 left-3 text-[11px] font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full shadow-sm border border-gray-100">
                      {product.category?.name}
                    </span>
                  </div>

                  {/* ===== تفاصيل المنتج ===== */}
                  <CardHeader className="p-5 pb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-green-600 tracking-wide uppercase">
                        {product.brand?.name || "Brand"}
                      </span>
                      <CardTitle className="text-base font-bold text-gray-800 line-clamp-1 transition-colors group-hover:text-green-600">
                        {product.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  {/* ===== السعر والنجوم ===== */}
                  <CardContent className="px-5 pb-4 pt-0 flex-grow flex flex-col justify-end">
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Price</span>
                        <p className="font-black text-gray-950 text-3xl tracking-tighter">
                          {product.price} <span className="text-sm text-green-500 font-bold ml-0.5">EGP</span>
                        </p>
                      </div>

                      {/* رندرة النجوم */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-0.5">
                          {renderStars(product.ratingsAverage)}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">({product.ratingsAverage})</span>
                      </div>
                    </div>
                  </CardContent>

                  {/* ===== أزرار التحكم ===== */}
                  <CardFooter className="p-5 pt-4 flex items-center justify-between gap-3 bg-gray-50/30 border-t border-gray-50/50 w-full">
                    <div className="flex-grow flex-1 w-full transition-transform duration-300 group-hover:scale-[1.01] [&>*]:w-full">
                      <AddToCart productId={product._id} />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }} // حركة خفيفة لزر المفضلة
                      className="flex-shrink-0"
                    >
                      <AddAndRemoveWishlist productId={product._id} />
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
