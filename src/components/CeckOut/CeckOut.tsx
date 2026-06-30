"use client";
import React, { useRef, useState } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import CachOut from "@/components/CachOut/CachOut";
import { createCheckoutSessionVisa2 } from "@/app/(pages)/card/_action/cartApi.action";

export default function CeckOut({ cartId }: { cartId: string }) {
  const detailsInput = useRef<HTMLInputElement | null>(null);
  const cityInput = useRef<HTMLInputElement | null>(null);
  const phoneInput = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false); // ✅ لحالة الـ spinner

  ////////////////////////////////////////////////////////






  

  async function checkOutSession() {
    if (!detailsInput.current?.value || !cityInput.current?.value || !phoneInput.current?.value) {
      toast.error("Please fill in all fields before proceeding.");
      return;
    }

    const phone = phoneInput.current.value.trim();
    const egyptianPhoneRegex = /^01[0|1|2|5][0-9]{8}$/;
    if (!egyptianPhoneRegex.test(phone)) {
      toast.error("Please enter a valid Egyptian phone number (e.g. 01012345678).");
      return;
    }

    setLoading(true);

    const shippingAddress = {
      details: detailsInput.current.value,
      city: cityInput.current.value,
      phone,
    };

    try {
      const data = await createCheckoutSessionVisa2(cartId, shippingAddress);

      if (data.status === "success") {
        toast.success("Redirecting to payment...");
        window.location.href = data.session.url;
      } else {
        toast.error("Checkout failed. Please try again.");
      }







      
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
      console.error(error);

    } finally {
      setLoading(false);
    }
  }







  ///////////////////////////////////////////////////////

  return (
    <>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <button className="w-full py-3 rounded-3xl cursor-pointer text-white font-medium shadow bg-green-600 hover:bg-green-700 hover:opacity-95 transition-all duration-200 z-56">
              Proceed to Checkout
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="w-full">Add Shipping Address Visa</DialogTitle>
              <DialogDescription>
                Please enter the information correctly.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">

              <div className="grid gap-3">
                <Label htmlFor="City">Enter your City</Label>

                <Input ref={cityInput} id="City" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="details">Enter your Details</Label>

                <Input ref={detailsInput} id="details" />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone">Enter your Phone</Label>

                <Input ref={phoneInput} id="phone" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>

              {/* زر الفيزا فيه سبينر */}
              <CachOut cartId={cartId} />

              <Button
                type="button"
                onClick={checkOutSession}
                disabled={loading}
                className="cursor-pointer bg-green-500 px-24 py-2 hover:bg-green-600 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  "Visa"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
