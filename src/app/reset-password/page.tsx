"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

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
  email: z.string().email("Please enter a valid email"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Password must contain uppercase, lowercase, number and special character.",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { 
      email: emailFromQuery || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: { email: string; newPassword: string }) {
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            newPassword: values.newPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully! ✅");
        // Redirect to login page
        router.push("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error("Network error");
    }

    setIsLoading(false);
  }

  return (
    <div className="h-screen flex justify-center items-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email and new password
        </p>

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
                      type="email"
                      placeholder="Enter your email"
                      className="p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />

            {/* New Password Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      className="p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
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
                "Reset Password"
              )}
            </Button>

            {/* Back Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline text-sm"
              >
                Back to login
              </button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
































