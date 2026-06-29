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
  resetCode: z
    .string()
    .min(6, "Reset code must be 6 digits")
    .max(6, "Reset code must be 6 digits")
    .regex(/^\d+$/, "Reset code must contain only numbers"),
});

export default function VerifyResetCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { resetCode: "" },
  });

  async function onSubmit(values: { resetCode: string }) {
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Code verified successfully! ✅");
        // Redirect to reset password page with email
        router.push(`/reset-password?email=${email || ""}`);
      } else {
        toast.error(data.message || "Invalid reset code");
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
          Verify Reset Code
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Reset Code Field */}
            <FormField
              control={form.control}
              name="resetCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Reset Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="p-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-600 text-center tracking-widest"
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
                "Verify Code"
              )}
            </Button>

            {/* Back Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-blue-600 hover:underline text-sm"
              >
                Back to forgot password
              </button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
















