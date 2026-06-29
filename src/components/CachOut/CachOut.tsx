"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation"; // تأكد من الاستيراد


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import React, { useRef, useState, useContext } from "react";
import { cartContext } from "@/components/context/CartContext";
import { placeOrderAction } from "@/app/(pages)/card/_action/cartApi.action";

export default function CeckOut({ cartId }: { cartId: string }) {

  const { SetCartData } = useContext(cartContext);

  const detailsInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const phoneInput = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);














const router = useRouter();




  async function Cach() {
  const details = detailsInput.current?.value?.trim();
  const city = cityInput.current?.value?.trim();
  const phone = phoneInput.current?.value?.trim();

  if (!details || !city || !phone) {
    toast.error("Please fill in all fields before proceeding.");
    return;
  }

  const egyptianPhoneRegex = /^01[0|1|2|5][0-9]{8}$/;
  if (!egyptianPhoneRegex.test(phone)) {
    toast.error("Please enter a valid phone number.");
    return;
  }

  setLoading(true);

  const shippingAddress = { details, city, phone };

  try {
    const data = await placeOrderAction(cartId, shippingAddress);

    if (data.status === "success") {
      toast.success("Order placed successfully!");
      SetCartData(null);
      router.push("/allorders");
      window.scrollTo({ top: 22, behavior: "smooth" });
    } else {
      toast.error("Checkout failed. Please try again.");
    }












  } catch (error: any) {
    toast.error("Something went wrong. Try again later.");
    console.error(error);
  } finally {
    setLoading(false);
  }
}










  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-amber-400 text-white px-2 py-2 rounded-md shadow-lg hover:bg-amber-500">
          Pay Cash
        </Button>
      </DialogTrigger>

      <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-55" />

      <DialogContent
        className="max-w-2xl bg-gray-900 text-white border border-gray-700 shadow-2xl p-8 rounded-2xl z-50 
                   max-h-[90vh] overflow-y-auto sm:max-h-[80vh] sm:max-w-[425px]"
        style={{
          backgroundColor: "rgba(17,17,17,0.98)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-amber-400 text-center">
            Cash Payment
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Please fill in your address details before confirming payment.
          </DialogDescription>
        </DialogHeader>

        {/* الحقول */}
        <div className="grid gap-2 py-24 md:py-8">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="details" className="text-right text-gray-300">
              Details
            </Label>
            <Input
              id="details"
              ref={detailsInput}
              placeholder="Your address"
              className="col-span-3 bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="city" className="text-right text-gray-300">
              City
            </Label>
            <Input
              id="city"
              ref={cityInput}
              placeholder="Your city"
              className="col-span-3 bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-gray-300">
              Phone
            </Label>
            <Input
              id="phone"
              ref={phoneInput}
              placeholder="Your phone number"
              className="col-span-3 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* الأزرار */}
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-md">
              Back to Visa
            </Button>
          </DialogClose>

          <Button
            onClick={Cach}
            type="submit"
            disabled={loading}
            className="bg-amber-500 cursor-pointer hover:bg-amber-600 text-black font-semibold px-6 py-2 rounded-md"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Confirm Cash Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
