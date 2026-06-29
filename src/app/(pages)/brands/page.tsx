import Link from "next/link";
import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryI } from "@/interfaces";
import { ArrowUpRight } from "lucide-react";

export default async function Brands() {
  // جلب بيانات الماركات (Brands)
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/brands", {
    next: { revalidate: 10 * 60 }, // كل 10 دقائق
  });

  const { data: brands }: { data: CategoryI[] } = await response.json();

  return (
    <div className="container mx-auto mt-24 px-4">
      {/* ===== عنوان القسم المميز ===== */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Our Top <span className="text-green-500">Brands</span>
        </h2>
        <p className="text-gray-500 mt-1 text-sm">Choose from the most trusted global brands</p>
      </div>

      {/* ===== شبكة الماركات المظبوطة ===== */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-center">
        {brands?.map((brand) => (
          <Card 
            key={brand._id} 
            className="flex flex-col h-full rounded-2xl bg-white border border-gray-100 transition-all duration-500 ease-out relative overflow-hidden group
              md:hover:-translate-y-2 md:hover:border-green-500 md:hover:shadow-xl md:hover:shadow-green-500/10"
          >
            {/* ===== لوجو البراند مظبوط 100% بدون مط أو ضغط ===== */}
            <div className="overflow-hidden aspect-square bg-gray-50/50 relative p-8 flex items-center justify-center border-b border-gray-50">
              <Link href={"/brands/" + brand._id} className="w-full h-full flex items-center justify-center">
                <img
                  src={brand.image}
                  className="max-w-full max-h-full object-contain cursor-pointer transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply"
                  alt={brand.name || "Brand"}
                />
              </Link>
              
              {/* سهم استكشاف صغير وأنيق يظهر فوق على اليمين عند الهوفر */}
              <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-gray-400 opacity-0 md:group-hover:opacity-100 md:group-hover:text-green-500 shadow-sm border border-gray-50 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* ===== تفاصيل البراند ===== */}
            <CardHeader className="p-5 text-center flex-grow flex flex-col justify-center bg-white">
              {/* اسم البراند الحقيقي واضح وبخط عريض */}
              <CardTitle className="text-lg font-extrabold text-gray-800 transition-colors group-hover:text-green-600 line-clamp-1">
                {brand.name}
              </CardTitle>
              
              {/* الـ slug المعالج بشكل شيك كـ وصف فرعي */}
              <CardDescription className="text-xs text-gray-400 mt-1 tracking-wider uppercase font-medium line-clamp-1">
                {brand.slug?.replace(/-/g, ' ')}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}