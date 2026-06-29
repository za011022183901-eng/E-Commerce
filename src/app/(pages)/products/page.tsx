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

export default async function Products() {
  // جلب البيانات من رابط Route API الصحيح
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/products", {
    next: { revalidate: 10 * 60 }
  });

  const { data: products }: { data: ProductsType[] } = await response.json();

  // دالة طباعة النجوم ديناميكياً بناءً على الـ rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <StarIcon key={i} className="text-yellow-500 w-4 h-4 fill-yellow-500" />
        );
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
        stars.push(
          <StarIcon key={i} className="text-gray-200 w-4 h-4 fill-gray-200" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="container mx-auto mt-24 px-4">
      {/* ===== عنوان القسم ===== */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Our <span className="text-green-500">Products</span>
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Explore our latest trends and best sellers</p>
      </div>

      {/* ===== شبكة المنتجات ===== */}
      <div className="flex flex-wrap items-stretch">
        {products?.map((product) => (
          <div
            key={product._id}
            className="p-3 flex w-full sm:w-full md:w-1/2 lg:w-1/3 xl:w-1/4 group"
          >
            <Card
              className="flex flex-col justify-between w-full rounded-2xl bg-white border border-gray-100 transition-all duration-500 ease-out relative overflow-hidden
                md:hover:-translate-y-2 md:hover:border-green-500 md:hover:shadow-xl md:hover:shadow-green-500/10"
            >
              {/* ===== صورة المنتج مع تأثير الهوفر ===== */}
              <div className="relative overflow-hidden bg-gray-50/50 rounded-t-2xl p-4 flex items-center justify-center h-64">
                <Link href={"/products/" + product.id} className="w-full h-full block">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </Link>
                
                {/* شارة القسم فوق الصورة */}
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

              {/* ===== السعر والنجوم الديناميكية ===== */}
              <CardContent className="px-5 pb-4 pt-0 flex-grow flex flex-col justify-end">
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <div className="flex flex-col">
  <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Price</span>
  <p className="font-black text-gray-950 text-2xl tracking-tight">
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

              {/* ===== أزرار التحكم (الزرار هيفرش هنا تماماً) ===== */}
              <CardFooter className="p-5 pt-4 flex items-center justify-between gap-3 bg-gray-50/30 border-t border-gray-50/50 w-full">
                {/* حاوية زر السلة مفرودة بالكامل وتجبر ما بداخلها على أخذ w-full */}
                <div className="flex-grow flex-1 w-full transition-transform duration-300 md:group-hover:scale-[1.01] [&>*]:w-full">
                  <AddToCart productId={product._id} />
                </div>
                
                {/* زر المفضلة ثابت ومحمي من الانضغاط */}
                <div className="flex-shrink-0 transition-transform duration-300 md:group-hover:scale-110">
                  <AddAndRemoveWishlist productId={product._id} />
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}






