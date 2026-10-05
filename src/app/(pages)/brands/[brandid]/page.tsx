import Link from "next/link";
import React from "react";
import { Params } from "next/dist/server/request/params";
import { products as Product } from "@/interfaces/products";
import ProductImage from "@/components/ProductImage/ProductImage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function BrandDetails({ params }: { params: Promise<Params> }) {
  const { brandid } = await params;

  // ✅ جلب كل المنتجات
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/products", {
    next: { revalidate: 60 * 60 * 24 },
  });
  const { data }: { data: Product[] } = await response.json();

  // ✅ تصفية المنتجات حسب البراند
  const brandProducts = data.filter((p) => p.brand._id === brandid);

  // ✅ لو مفيش منتجات
  if (!brandProducts.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 space-y-4">
        <p className="text-gray-700 font-semibold text-lg">
          No products found for this brand
        </p>
        <Link
          href="/brands"
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Go back to Brands
        </Link>
      </div>
    );
  }

  // ✅ عرض المنتجات في Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-6 mt-20">
      {brandProducts.map((product) => (
        <Card
          key={product._id}
          className="flex flex-col rounded-2xl shadow-sm hover:shadow-md transition"
        >
          {/* ✅ الصورة */}
          <div className="overflow-hidden aspect-[4/5]">
            <Link href={`/products/${product._id}`}>
              <ProductImage
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
              {product.brand?.name}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-[17px] font-medium text-green-700 dark:text-white">
              Price: {product.price} EGP
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
