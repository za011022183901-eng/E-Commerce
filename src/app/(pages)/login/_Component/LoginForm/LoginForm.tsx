"use client"

import React, { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";

// ===== Validation schema =====
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Email must follow the standard format.",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Password must contain uppercase, lowercase, number and special character.",
    }),
});

type FormFields = z.infer<typeof formSchema>;

// ===== Login Form Component =====
export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

///////////////////////////////////////////////////////



const searchParams = useSearchParams();

const callBackURL = searchParams.get("callBackUrl");





///////////////////////////////////////////////////////////////////////

  async function onSubmit(values: FormFields) {
    setIsLoading(true);
    setErrorMessage(null);

    const res = await signIn("credentials", { ...values, redirect: false });

    if (res?.ok) {
      toast.success("Congratulations! Sir 🎉");
      window.location.href = callBackURL ??  "/products"; // 🌐 Reload كامل للصفحة
    } else {
      setErrorMessage(res?.error || "Incorrect data");
      toast.error(res?.error || "Incorrect data");
    }

    setIsLoading(false);
  }


///////////////////////////////////////////////////////////////////////////


  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >



      <Card className="md:w-[120%]">





        {/* ===== عرض الخطأ ===== */}
        {errorMessage && (
          <div className="bg-red-100 text-red-800 text-center">
            {errorMessage}
          </div>
        )}
{<Form {...form}>
  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className="flex flex-col justify-center space-y-16 w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10"
  >
    {/* ===== Email Field ===== */}
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem className="my-4 sm:my-6">
          <FormLabel className="text-2xl sm:text-3xl">Email</FormLabel>
          <FormControl>
            <Input
              className="text-xl sm:text-2xl md:text-2xl p-4 sm:p-5 md:p-6 rounded-xl border-2 border-gray-300 focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none shadow-md transition-all duration-300"
              placeholder="example@email.com"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-lg" />
        </FormItem>
      )}
    />

    {/* ===== Password Field ===== */}
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem className="my-4 sm:my-6">
          <FormLabel className="text-2xl sm:text-3xl">Password</FormLabel>
          <FormControl>
            <Input
              type="password"
              className="text-xl sm:text-2xl md:text-2xl p-4 sm:p-5 md:p-6 rounded-xl border-2 border-gray-300 focus:border-green-600 focus:ring-4 focus:ring-green-100 outline-none shadow-md transition-all duration-300"
              placeholder="Enter your password"
              {...field}
            />
          </FormControl>
          <FormMessage className="text-lg" />
        </FormItem>
      )}
    />

    <Button
      disabled={isLoading}
      type="submit"
      className="bg-green-600 hover:bg-green-700 w-full text-white cursor-pointer text-2xl sm:text-3xl py-4 sm:py-5 px-8 sm:px-12 rounded-2xl flex mx-auto shadow-lg transition-transform hover:scale-105 mt-10 p-3"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : <h2>Signin</h2>}
    </Button>

   {/* ===== Links Section ===== */}
<div className="text-center text-black text-2xl sm:text-base mt-4">
  <p className="mb-1 text-black">
    Don't have an account?{" "}
    <span
      className="text-blue-600 font-medium  cursor-pointer hover:underline"
      onClick={() => router.push("/register")}
    >
      Register here
    </span>
  </p>
  <p className="mb-0 text-black">
    Forgot your password?{" "}
    <span
      className="text-blue-600 font-medium cursor-pointer hover:underline"
      onClick={() => router.push("/forgot-password")}
    >
      Reset it here
    </span>
  </p>
</div>





   

    
  </form>
</Form>
}

      </Card>
    </motion.div>
  );
}
