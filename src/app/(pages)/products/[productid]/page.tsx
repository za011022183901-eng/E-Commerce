import { products } from '@/interfaces';
import { Params } from 'next/dist/server/request/params';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import React from 'react';
import AddToCart from '@/components/AddToCard/AdToCard';
import Whilshit from '@/components/AddAndRemoveWishlist/page';
import ProductGallery from '@/components/ProductGallery/ProductGallery';
// استيراد المعرض الجديد (عدل المسار حسب مكان حفظك للملف)

export default async function ProductsDetails({ params }: { params: Params }) {
  let { productid } = params;

  const response = await fetch('https://ecommerce.routemisr.com/api/v1/products/' + productid);
  const { data: product }: { data: products } = await response.json();

  // دالة رندرة النجوم الديناميكية
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <div key={i} className="relative inline-block">
            <Star className="w-4 h-4 text-gray-200" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden h-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-200" />);
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
        
        {/* ===== الجزء الأيسر: تم نقل المعرض بالكامل للمكون الجديد ذو الـ State ===== */}
        <ProductGallery images={product.images} title={product.title} />

        {/* ===== الجزء الأيمن: تفاصيل المنتج الواسعة والمنسقة ===== */}
        <div className="w-full md:w-[45%] flex flex-col justify-between space-y-8 py-4">
          
          {/* القسم الأول: التصنيف + الاسم + التقييمات */}
          <div className="space-y-4">
            <span className="inline-block text-xs font-bold text-green-600 tracking-widest uppercase bg-green-50 px-3 py-1 rounded-md">
              {product.category?.name}
            </span>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-100">
                <div className="flex items-center gap-0.5">{renderStars(product.ratingsAverage)}</div>
                <span className="text-xs font-bold text-yellow-800 ml-0.5">{product.ratingsAverage}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-gray-500 hover:text-blue-600 cursor-pointer underline underline-offset-4">
                {product.ratingsQuantity} Customer Reviews
              </span>
            </div>
          </div>

          {/* القسم الثاني: الوصف التفصيلي */}
          <div className="space-y-2 border-t border-b border-gray-100 py-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Description</h3>
            <p className="text-base text-gray-600 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* شارات الثقة الفاخرة للبراندات العالمية */}
          <div className="grid grid-cols-3 gap-4 text-center border-b border-gray-100 pb-6 text-gray-500">
            <div className="flex flex-col items-center gap-1.5">
              <Truck className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">1 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <RotateCcw className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">30 Days Return</span>
            </div>
          </div>

          {/* القسم الثالث: السعر العملاق وأزرار الأكشن */}
          <div className="space-y-6 pt-2">
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price Total</span>
              <p className="font-black text-gray-950 text-4xl tracking-tight">
                {product.price} <span className="text-lg text-green-500 font-black ml-0.5">EGP</span>
              </p>
            </div>

            <div className="flex items-center gap-4 w-full">
              <div className="flex-grow flex-1 transition-all duration-300 active:scale-[0.98] [&>*]:w-full [&_button]:h-14 [&_button]:text-base [&_button]:font-bold [&_button]:rounded-2xl [&_button]:bg-green-500 [&_button]:text-white [&_button]:hover:bg-green-600 [&_button]:shadow-lg [&_button]:shadow-green-500/20">
                <AddToCart productId={product._id} />
              </div>
              
              <div className="flex-shrink-0 transition-all duration-300 active:scale-90 [&_button]:h-14 [&_button]:w-14 [&_button]:rounded-2xl [&_button]:border-gray-200 [&_button]:hover:border-red-200 [&_button]:hover:bg-red-50">
                <Whilshit productId={product._id} />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <span className="inline-block text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                Product SKU: {product._id}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}