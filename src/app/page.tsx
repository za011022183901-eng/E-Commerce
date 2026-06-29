"use client"
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>





   <div className="container p-10 h-screen">
        <div className="md:w-1/2 mx-auto items-center">
          <div className="flex text-center flex-col items-center gap-6 py-72">


    <motion.div initial={{ y: -130, opacity: 0 }}    animate={{ y: 0, opacity: 1 }}    transition={{ duration: 1, ease: "easeOut" }}>
                   
                   <h1 className="md:text-6xl font-bold text-center text-5xl">
                    Welcome to <span className="text-green-600">ShopMart</span>
                   </h1>  

             </motion.div>

          

    <motion.div initial={{  opacity: 0 }}    animate={{  opacity: 1 }}    transition={{ duration: 2, ease: "backInOut" }}>

            <p className="text-2xl p-4 pb-7">
              Discover the latest technology, fashion and lifestyle products,
              quality guaranteed with fast shipping and excellent customerservice.
            </p>

          </motion.div>

        

                

               <motion.div initial={{ y: 130, opacity: 0 }}    animate={{ y: 0, opacity: 1 }}    transition={{ duration: 1, ease: "easeOut" }}>

                   
                    <div className="flex gap-3">
              {/* زرار أخضر */}
              <Link href="/products">
                <Button
                  className="cursor-pointer px-8 py-4 text-lg 
                    bg-green-600 hover:bg-green-700 
                    transition-transform transform hover:scale-105 
                    text-white rounded-xl shadow-lg font-semibold"
                >
                  Shop now
                </Button>
              </Link>

              {/* زرار أبيض عادي + أخضر عند hover */}
              <Link href="/categories">
                <Button
                  className="cursor-pointer px-8 py-4 text-lg 
                    bg-white text-green-600 border border-green-600
                    hover:bg-green-600 hover:text-white 
                    transition-transform transform hover:scale-105 
                    rounded-xl shadow-lg font-semibold"
                >
                  Browse categories
                </Button>
              </Link>
            </div>


                </motion.div>


           
          </div>
        </div>
      </div>




     
    </>
  );
}
