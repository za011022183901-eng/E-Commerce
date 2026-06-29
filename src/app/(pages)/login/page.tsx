 "use client"
import { LoginForm } from "./_Component/LoginForm/LoginForm";
import { motion } from "framer-motion";


export default function ImageAccordion() {
  return (


    <>
<div className="grid grid-cols-1 md:grid-cols-2 min-h-screen relative pb-14 md:pb-0">

  
    <motion.div initial={{ x: -100, opacity: 0 }}    animate={{ x: 0, opacity: 1 }}    transition={{ duration: 1, ease: "easeOut" }}>

   <div className="flex flex-col justify-start md:justify-center md:items-start px-4 sm:px-6 md:px-10 lg:px-20 mt-6 md:mt-56">
          

        {/* العمود الأول: H1 + H2 */}


          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-start mt-4 sm:mt-20 md:mt-32 max-w-full md:max-w-lg lg:max-w-xl">
            <span className="text-green-600">You</span> Are Welcome
          </h1>

          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl mt-3 sm:mt-4 md:mt-4 lg:mt-6 text-center md:text-start leading-relaxed max-w-full md:max-w-lg lg:max-w-xl">
            Shop from a wide range of premium items — from fashion and electronics 
            to home essentials — all in one place. Discover amazing deals and 
            enjoy fast delivery, secure payments, and easy returns on every order.
          </h2>
        </div>
      
    </motion.div>
      

     






        {/* العمود الثاني: LoginForm */}
        <div className="flex flex-col justify-start md:justify-center items-center md:min-h-[80vh] px-4 sm:px-12 md:px-10 lg:px-20 py-6 sm:py-8 w-full">
          <div className="w-full max-w-md mt-0 md:mt-0 ">
            <LoginForm />
          </div>
        </div>

      </div>
    </>
  );
}
