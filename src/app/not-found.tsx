"use client"
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      {/* Gift Icon */}
      <div className="text-7xl mb-5">🎁</div>

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-3">Page Not Found</h1>

      {/* Description */}
      <p className="text-gray-500 mb-8 text-center max-w-md text-lg">
        Looks like the page you're searching for doesn't exist.  
        Take this gift and head back to your protected area! 😄
      </p>

      {/* Back Button */}
      <Link href="/products">
        <Button
          className="flex cursor-pointer items-center justify-center gap-2 bg-green-500 hover:bg-green-600 transition text-white rounded-xl shadow-md px-8 py-3 text-lg"
        >
          🎀  Back to Protected Area
        </Button>
      </Link>
    </main>
  );
}
