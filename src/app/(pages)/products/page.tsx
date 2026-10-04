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
import ProductImage from "@/components/ProductImage/ProductImage";
import { ArrowUpRight, Search, StarIcon, X } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export const dynamic = "force-dynamic";

function HighlightedText({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return text;

  const escapedNeedle = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedNeedle})`, "ig"));
  return <>{parts.map((part, index) => part.toLocaleLowerCase() === needle.toLocaleLowerCase()
    ? <mark key={`${index}-${part}`} className="rounded bg-emerald-200 px-0.5 text-emerald-950 dark:bg-emerald-300">{part}</mark>
    : part)}</>;
}

export default function Products() {
  const [products, setProducts] = React.useState<ProductsType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);

  React.useEffect(() => {
    setSearchQuery(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  // جلب البيانات في Client Component
  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("https://ecommerce.routemisr.com/api/v1/products", { cache: "force-cache" });
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

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredProducts = normalizedQuery
    ? products.filter((product) => [product.title, product.description, product.category?.name, product.brand?.name]
        .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)))
    : products;

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
    <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-5 pb-20 pt-28 sm:px-8 lg:px-8 xl:px-12">
      <motion.div aria-hidden="true" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(125deg,rgba(16,185,129,.07),transparent_35%,rgba(6,182,212,.08),transparent_75%)] bg-[length:200%_200%]" />
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
      <section className="mx-auto max-w-[1680px]">
      <AnimatedPageHeading
        eyebrow="The ShopMart edit"
        title="Our Products"
        accent="Products"
        subtitle="Explore our latest trends and best sellers"
      />

      <div className="relative z-30 -mt-8 mb-8 ml-auto max-w-xl">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/90 px-4 shadow-sm transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900/90">
          <Search className="shrink-0 text-emerald-600" size={20} />
          <input role="combobox" aria-controls="product-suggestions" value={searchQuery} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by product, brand, or category" aria-label="Search products" aria-autocomplete="list" aria-expanded={searchFocused && !!normalizedQuery} className="h-12 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100" />
          {searchQuery && <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setSearchQuery("")} aria-label="Clear search" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"><X size={17} /></button>}
        </div>
        {searchFocused && normalizedQuery && <div id="product-suggestions" role="listbox" aria-label="Product suggestions" className="absolute left-0 right-0 top-[calc(100%+8px)] max-h-96 overflow-y-auto rounded-2xl border border-emerald-100 bg-white p-2 shadow-2xl shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900">
          {filteredProducts.slice(0, 7).map((product) => <Link key={product._id} role="option" aria-selected="false" href={`/products/${product.id}`} onMouseDown={(event) => event.preventDefault()} onClick={() => setSearchFocused(false)} className="flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none dark:hover:bg-slate-800 dark:focus:bg-slate-800">
            <span className="flex min-w-0 items-center gap-3"><ProductImage src={product.imageCover} alt="" aria-hidden="true" className="h-12 w-12 shrink-0 rounded-xl bg-slate-100 object-cover dark:bg-slate-800" /><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100"><HighlightedText text={product.title} query={normalizedQuery} /></span><span className="mt-1 block truncate text-xs text-slate-500 dark:text-slate-400">{product.brand?.name || "ShopMart"} · {product.category?.name || "Product"}</span></span></span>
            <ArrowUpRight className="shrink-0 text-emerald-600" size={17} />
          </Link>)}
          {!filteredProducts.length && <p className="px-4 py-5 text-sm text-slate-500 dark:text-slate-400">No matching products. Try another name.</p>}
        </div>}
      </div>
      {!loading && normalizedQuery && <p aria-live="polite" className="mx-auto mb-5 max-w-[1680px] text-sm text-slate-500 dark:text-slate-400">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found for “{searchQuery.trim()}”</p>}

      {/* ===== شبكة المنتجات مع أنيميشن الظهور ===== */}
      <AnimatePresence>
        {loading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProducts.length ? filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                className="product-card group min-w-0"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <Card className="relative flex w-full flex-col justify-between gap-0 overflow-hidden rounded-[1.7rem] border border-white bg-white/80 p-5 shadow-[0_12px_35px_rgb(15,23,42,.08)] backdrop-blur transition-all duration-500 ease-out hover:border-green-300 hover:shadow-2xl hover:shadow-green-500/10">
                  {/* ===== صورة المنتج مع تأثير الهوفر ===== */}
                  <div className="relative overflow-hidden bg-gray-50/50 rounded-t-2xl p-4 flex items-center justify-center h-[19rem]">
                    <Link href={"/products/" + product.id} className="w-full h-full block relative">
                      <ProductImage
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
                        <HighlightedText text={product.title} query={normalizedQuery} />
                      </CardTitle>
                    </div>
                  </CardHeader>

                  {/* ===== السعر والنجوم ===== */}
                  <CardContent className="px-5 pb-4 pt-0 flex-grow flex flex-col justify-end">
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Price</span>
                        <p className="font-black text-gray-950 text-3xl tracking-tighter dark:text-white">
                          {product.price} <span className="text-sm text-green-500 font-bold ml-0.5 dark:text-white">EGP</span>
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
            )) : <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/70"><p className="text-lg font-bold text-slate-800 dark:text-slate-100">No products found</p><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try another product name, brand, or category.</p></div>}
          </motion.div>
        )}
      </AnimatePresence>
      </section>
    </main>
  );
}

