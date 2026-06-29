"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Loader2 } from "lucide-react";

// ===== Validation schema =====
const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .refine((val) => val.endsWith("@gmail.com"), {
      message: "Email must be a @gmail.com address",
    }),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: { email: string }) {
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Reset code sent to your email! ✅");
        // Redirect to verify code page with email
        router.push(`/verify-reset-code?email=${values.email}`);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Network error");
    }

    setIsLoading(false);
  }

  return (
    <div className="h-screen flex justify-center items-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 cursor-pointer hover:bg-green-700 w-full text-white text-xl py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
