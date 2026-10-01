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
import AnimatedPageHeading from "@/components/AnimatedPageHeading/AnimatedPageHeading";
import { ArrowUpRight, StarIcon } from 'lucide-react';
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
    <main className="relative min-h-screen overflow-hidden px-5 pb-20 pt-28 sm:px-8 lg:px-8 xl:px-12">
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-28 top-32 h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -50, 0], y: [0, -35, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 top-64 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl"
      />
      <section className="mx-auto max-w-[1400px]">
      <AnimatedPageHeading
        eyebrow="The ShopMart edit"
        title="Our Products"
        accent="Products"
        subtitle="Explore our latest trends and best sellers"
      />

      {/* ===== شبكة المنتجات مع أنيميشن الظهور ===== */}
      <AnimatePresence>
        {loading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products?.map((product) => (
              <motion.div
                key={product._id}
                className="product-card group min-w-0"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <Card className="relative flex w-full flex-col justify-between gap-0 overflow-hidden rounded-[1.7rem] border border-white bg-white/80 p-3 shadow-[0_12px_35px_rgb(15,23,42,.08)] backdrop-blur transition-all duration-500 ease-out hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/10">
                  {/* ===== صورة المنتج مع تأثير الهوفر ===== */}
                  <div className="relative overflow-hidden bg-gray-50/50 rounded-t-2xl p-4 flex items-center justify-center h-64">
                    <Link href={"/products/" + product.id} className="w-full h-full block relative">
                      <img
                        src={product.imageCover}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </Link>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-2xl bg-white/95 text-emerald-700 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                      <ArrowUpRight size={19} />
                    </span>

                    {/* شارة القسم */}
                    <span className="absolute left-3 top-3 z-10 rounded-full border border-gray-100 bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-700 shadow-sm backdrop-blur-sm">
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
      </section>
    </main>
  );
}
