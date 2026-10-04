"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Pencil, Phone } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
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
import toast from "react-hot-toast";
import { updateProfileServerAction } from "../../card/_action/cartApi.action";
import AddressesSection from "@/components/profile/AddressesSection";

export default function Page() {


  const { data: session, update: updateSession } = useSession();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "", // يبدأ فاضي
  });

  useEffect(() => {
    if (!session?.user) return;
    setFormData((current) => ({ ...current, name: session.user.name || "", email: session.user.email || "" }));
  }, [session?.user?.name, session?.user?.email]);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });


  
const validateField = (name: string, value: string) => {
  switch (name) {
    case "name":
      return value.trim().length < 3 ? "Name must be at least 3 characters" : "";
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value) ? "Please enter a valid email" : "";
   case "phone":
      const phoneRegex = /^0\d{9,10}$/; // يبدأ بـ 0 ويكون 10 أو 11 رقم
      if (!value) return "Phone is required";
      return !phoneRegex.test(value) ? "Phone must start with 0 and be 10–11 digits" : "";
    default:
      return "";
  }
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      phone: validateField("phone", formData.phone),
    };
    setErrors(newErrors);


    setLoading(true);
    try {
      const updatedUser = await updateProfileServerAction(formData); // Server Action
      if (updateSession) updateSession({ user: updatedUser });
      
      await signOut({ redirectTo: "/login" })

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <>
    <main className="relative max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-48 border border-gray-200 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 dark:text-slate-50">
          <User className="h-6 w-6 text-blue-500" />
          Personal Information
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm transition dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100">
              <Pencil size={16} />
              Edit
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal information and click save.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-4 py-2">
              <div className="grid gap-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
              </div>

              <div className="grid gap-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>

              <div className="grid gap-1">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01012345678"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
              </div>

              <DialogFooter className="mt-4 flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>


            <Button className="bg-green-700 hover:bg-green-900 cursor-pointer"
            type="submit" 
             disabled={
             loading || 
             !formData.name || 
             !formData.email || 
             !formData.phone || 
            Object.values(errors).some(err => err)
                       }
              >
            {loading ? "Saving..." : "Save changes"}
            </Button>

              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-blue-50 p-5 rounded-md flex items-center gap-5 mb-5 dark:bg-slate-800 dark:border dark:border-blue-400/30">
        <User className="h-6 w-6 text-blue-500" />
        <div>
          <p className="text-base font-medium text-gray-500 dark:text-slate-300">Full Name</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-white">{session?.user?.name}</p>
        </div>
      </div>

      <div className="bg-green-50 p-5 rounded-md flex items-center gap-5 mb-5 dark:bg-slate-800 dark:border dark:border-emerald-400/30">
        <Mail className="h-6 w-6 text-green-500" />
        <div>
          <p className="text-base font-medium text-gray-500 dark:text-slate-300">Email Address</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-white break-all">{session?.user?.email}</p>
        </div>
      </div>

      <div className="bg-purple-50 p-5 rounded-md flex items-center gap-5 dark:bg-slate-800 dark:border dark:border-purple-400/30">
        <Shield className="h-6 w-6 text-purple-500" />
        <div>
          <p className="text-base font-medium text-gray-500 dark:text-slate-300">Account Role</p>
          <span className="text-base px-3 py-1 rounded-full bg-purple-600 text-white font-semibold inline-block dark:bg-purple-500 dark:text-white">
            {session?.user?.role || "Regular User"}
          </span>
        </div>
      </div>
    </main>
    <div className="mx-auto mt-8 max-w-6xl px-4 pb-16 sm:px-6">
      <AddressesSection />
    </div>
    </>
  );
}
