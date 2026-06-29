"use client";
import { cartContext } from "@/components/context/CartContext";
import Loading from "@/components/Loadingg/page";
import React, { useContext } from "react";
import Link from "next/link";








import AddAndRemoveWishlist from "@/components/AddAndRemoveWishlist/page";
import AddToCart from "@/components/AddToCard/AdToCard";


export default function CartItem() {
  const { wishlistData, loading } = useContext(cartContext);

  return (
    <>


     {loading ? <Loading/> : wishlistData?.count!>0 ?  <div className="min-h-screen py-36 px-6 ">
        {/* ✅ خلى الهيدر على الشمال */}
        <header className="mb-8 text-left max-w-[1100px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight"> Shopping Cart   </h1>
          <p className="text-gray-500 mt-2">
            {wishlistData?.count || 0} item(s) in your cart
          </p>
        </header>

        {/* ✅ كل العناصر بنفس عرض الهيدر */}
        <div className="flex flex-col gap-6 items-center">
          {wishlistData?.data?.map((item) => (
            <div
              key={item._id}
              className="border rounded-2xl p-6 flex justify-between items-center shadow-md bg-white w-full max-w-[1100px] hover:shadow-lg transition-all duration-300"
            >
              {/* الصورة + التفاصيل */}
              <div className="flex items-center gap-6">
                <img
                  src={item.imageCover}
                  alt={item.title}
                  width={120}
                  height={120}
                  className="rounded-md"
                />
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.brand?.name}</p>
                </div>
              </div>






              {/* السعر + الزرين */}
              <div className="flex flex-col items-end gap-4">
                <span className="font-semibold text-gray-800 text-lg">
                  EGP {item.price}
                </span>
                
                <div className="flex gap-3">

                               
                 <AddAndRemoveWishlist  productId={item._id}/>

                 <AddToCart productId={item._id} />     

                </div>
              </div>
            </div>
          ))}
        </div>
      </div> : 
      
      
      <div className="flex flex-col justify-center items-center min-h-screen w-full mx-auto space-y-4 text-center">
  <p className="text-gray-700 font-semibold text-lg">
    Your wishlist is empty 💔  
    Go to the products page and add your favorite items!
  </p>
  <Link
    href="/products"
    className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
  >
    Go to Products ❤️
  </Link>
</div>
  }
     
     
    </>
  );
}
