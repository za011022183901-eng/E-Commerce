"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { Loader2, ArrowRight, ShieldCheck } from "lucide-react";

// ===== Validation schema =====
const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
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
    rePassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters." }),
    phone: z
      .string()
      .min(11, { message: "Phone must be 11 digits" })
      .max(11, { message: "Phone must be 11 digits" }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

type FormFields = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
  });

  async function onSubmit(values: FormFields) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Welcome aboard! 🎉");
        router.push("/login");
      } else {
        setErrorMessage(data.message || "Registration failed");
        toast.error(data.message || "Registration failed");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
      toast.error(error.message || "Something went wrong");
    }

    setIsLoading(false);
  }

  return (
    // تعديل الـ الحاوية الرئيسية: أضفنا pt-28 للموبايل و md:pt-36 للشاشات الأكبر عشان تبعد تماماً عن الـ Navbar
    <div className="relative min-h-screen flex flex-col justify-start md:items-center px-4 sm:px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50/70 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 overflow-hidden pt-28 pb-16 md:pt-36">
      
      {/* هالة ضوئية خلفية باللون الأخضر والأزرق الناعم جداً لإعطاء طابع الـ Premium */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[350px] bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <motion.div animate={{ x: [0, 48, 0], y: [0, 30, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -left-28 top-40 h-72 w-72 rounded-full bg-emerald-300/35 blur-3xl" />
      <motion.div animate={{ x: [0, -45, 0], y: [0, -25, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-200/45 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -3 }}
        className="w-full max-w-2xl relative z-10 mx-auto"
      >
        {/* الكارد الرئيسي زجاجي ناعم وبمساحات داخلية أوسع (p-10 md:p-14) */}
        <div className="bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl p-10 md:p-14 shadow-[0_20px_70px_rgb(5,46,22,0.10)] border border-emerald-100/70 dark:border-slate-700 rounded-[32px]">
          
          {/* الـ Header مع الأيقونة الخضراء */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="h-14 w-14 rounded-2xl bg-emerald-950 flex items-center justify-center shadow-xl shadow-emerald-950/10 mb-5">
              <ShieldCheck className="h-7 w-7 text-emerald-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-gray-500 dark:text-slate-300 text-base mt-2">
              Join us today and experience the new standard.
            </p>
          </div>

          {/* التنبيه بالأخطاء مع إنيميشن انسيابي */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50/60 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm p-4 rounded-xl mb-6 font-medium flex items-center gap-2.5"
              >
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* حقل الاسم بالكامل */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-emerald-800/80 dark:text-emerald-300">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="h-13 rounded-xl border-gray-200 bg-white/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600 transition-all duration-200 placeholder:text-gray-400 text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 font-medium" />
                  </FormItem>
                )}
              />

              {/* البريد ورقم الهاتف جنب بعض */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-emerald-800/80 dark:text-emerald-300">Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          {...field}
                          className="h-13 rounded-xl border-gray-200 bg-white/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600 transition-all duration-200 placeholder:text-gray-400 text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-emerald-800/80 dark:text-emerald-300">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="01xxxxxxxxx"
                          {...field}
                          className="h-13 rounded-xl border-gray-200 bg-white/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600 transition-all duration-200 placeholder:text-gray-400 text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              {/* كلمة المرور وتأكيدها جنب بعض */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-emerald-800/80 dark:text-emerald-300">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-13 rounded-xl border-gray-200 bg-white/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600 transition-all duration-200 placeholder:text-gray-400 text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 font-medium" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rePassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-emerald-800/80 dark:text-emerald-300">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-13 rounded-xl border-gray-200 bg-white/60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-600 transition-all duration-200 placeholder:text-gray-400 text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500 font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              {/* زرار الإرسال الأخضر الفخم */}
              <Button
                disabled={isLoading}
                type="submit"
                className="relative overflow-hidden w-full h-13 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all duration-300 group mt-6 active:scale-[0.98] text-base"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-white/80" />
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* رابط تسجيل الدخول السفلي */}
          <p className="text-center text-gray-500 dark:text-slate-300 mt-10 text-base">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-emerald-700 dark:text-emerald-300 font-bold hover:text-emerald-800 dark:hover:text-emerald-200 hover:underline underline-offset-4 decoration-emerald-500 transition-all"
            >
              Log in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}


