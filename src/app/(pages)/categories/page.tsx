import Link from "next/link";
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryI } from "@/interfaces";
import { ArrowRightIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Categories() {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/categories", {
    next: { revalidate: 10 * 100 }, // كل 10 دقائق
  });

  const { data: categories }: { data: CategoryI[] } = await response.json();

  return (
    <div className="container mx-auto mt-24 px-4">
      {/* ===== عنوان القسم المميز ===== */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Shop By <span className="text-green-500">Categories</span>
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Find everything you are looking for instantly</p>
      </div>

      {/* ===== شبكة الأقسام ===== */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center">
        {categories?.map((category) => (
          <Card 
            key={category._id} 
            className="flex flex-col h-full rounded-2xl bg-white border border-gray-100 transition-all duration-500 ease-out relative overflow-hidden group
              md:hover:-translate-y-2 md:hover:border-green-500 md:hover:shadow-xl md:hover:shadow-green-500/10"
          >
            {/* ===== صورة القسم مع تأثير زووم احترافي ===== */}
            <div className="overflow-hidden aspect-[4/5] bg-gray-50 relative">
              <Link href={"/categories/" + category._id} className="w-full h-full block">
                <img
                  src={category.image}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-700 ease-out group-hover:scale-105"
                  alt={category.name || "Category"}
                />
              </Link>
              
              {/* طبقة تظليل خفيفة تظهر عند الهوفر تزيد الصورة جمالاً */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            {/* ===== العنوان والوصف (CardHeader) ===== */}
            <CardHeader className="p-5 pb-2">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-bold text-gray-800 transition-colors group-hover:text-green-600 line-clamp-1">
                  {category.name}
                </CardTitle>
                {/* رجعنا الـ CardDescription وحطينا فيه الـ slug بشكل شيك */}
                <CardDescription className="text-xs text-gray-400 tracking-wide uppercase font-medium line-clamp-1">
                  Tags: {category.slug?.replace(/-/g, ' ')}
                </CardDescription>
              </div>
            </CardHeader>

            {/* ===== السعر والتفاصيل المنسية (CardContent) ===== */}
            <CardContent className="px-5 pb-5 pt-0 mt-auto flex flex-col gap-4">
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex flex-col">
  <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Starts From</span>
  <p className="font-black text-gray-950 text-2xl tracking-tight">
    500 <span className="text-sm text-green-500 font-bold ml-0.5">EGP</span>
  </p>
</div>

                {/* الـ ID اللي كان منسي ظبطناه هنا ككود مرجعي صغير للقسم */}
                <div className="text-right">
                  <span className="text-[10px] text-gray-300 font-mono block">REF_ID</span>
                  <span className="text-[10px] text-gray-400 font-mono font-bold uppercase truncate max-w-[80px] block">
                    {category._id.substring(0, 8)}
                  </span>
                </div>
              </div>

              {/* زرار "استكشف الآن" عشان يملأ الكارت ويخليه روعة زيه زي المنتجات */}
              <Link 
                href={"/categories/" + category._id}
                className="w-full bg-gray-50 text-gray-700 group-hover:bg-green-500 group-hover:text-white font-semibold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
              >
                Explore Now
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
