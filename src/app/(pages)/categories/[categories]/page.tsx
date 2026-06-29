import Link from "next/link";
import React from "react";
import { Params } from "next/dist/server/request/params";
import { products as Product } from "@/interfaces/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CategoryDetails({ params }: { params: Params }) {
  const { categories } = params;

  // ✅ جلب المنتجات حسب الكاتيجوري
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products?category=${categories}`,
    { next: { revalidate: 10 * 60 } }
  );
  const { data: categoryProducts }: { data: Product[] } = await response.json();

  // ✅ لو مفيش منتجات
  if (!categoryProducts.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 space-y-4">
        <p className="text-gray-700 font-semibold text-lg">
          No products found for this category
        </p>
        <Link
          href="/categories"
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Go back to categories
        </Link>
      </div>
    );
  }

  // ✅ عرض المنتجات في Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1  md:grid-cols-2 xl:grid-cols-4 gap-6 p-4 mt-20">
      {categoryProducts.map((product) => (
        <Card
          key={product._id}
          className="flex flex-col rounded-2xl shadow-sm hover:shadow-md transition"
        >
          {/* ✅ الصورة */}
          <div className="overflow-hidden aspect-[4/5]">
            <Link href={`/products/${product._id}`}>
              <img
                src={product.imageCover}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105 rounded-t-2xl"
                alt={product.title}
              />
            </Link>
          </div>

          {/* ✅ التفاصيل */}
          <CardHeader>
            <CardTitle className="truncate text-lg font-semibold text-gray-800">
              {product.title.length > 25
                ? product.title.slice(0, 25) + "..."
                : product.title}
            </CardTitle>
            <CardDescription className="truncate text-gray-500 text-sm">
              {product.category?.name}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm font-medium text-green-700">
              Price: {product.price} EGP
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
