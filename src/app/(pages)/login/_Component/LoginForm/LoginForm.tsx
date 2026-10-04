"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Loader2, LockKeyhole, Mail, MoveRight } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
type FormFields = z.infer<typeof formSchema>;

export function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<FormFields>({ resolver: zodResolver(formSchema), defaultValues: { email: "", password: "" } });
  const { reset } = form;

  useEffect(() => {
    const savedCredentials = sessionStorage.getItem("shopmart-registration-login");
    if (!savedCredentials) return;

    try {
      const credentials = JSON.parse(savedCredentials) as FormFields;
      if (typeof credentials.email !== "string" || typeof credentials.password !== "string") return;

      reset({ email: credentials.email, password: credentials.password });
      sessionStorage.removeItem("shopmart-registration-login");
    } catch {
      // Ignore invalid or outdated registration data.
    }
  }, [reset]);

  async function onSubmit(values: FormFields) {
    setIsLoading(true); setErrorMessage(null);
    try {
      const requestedUrl = searchParams.get("callBackUrl") ?? "/profile";
      const callbackUrl = requestedUrl.startsWith("/") && !requestedUrl.startsWith("//") ? requestedUrl : "/profile";
      const result = await signIn("credentials", { ...values, redirect: false, redirectTo: callbackUrl });
      if (result?.ok && !result.error) {
        toast.success("Welcome back! ✨");
        window.location.assign(callbackUrl);
      }
      else { 
        const message = result?.error === "CredentialsSignin"
          ? "The sign-in service could not verify this account. Check the details or try again shortly."
          : "Unable to complete sign-in. Please try again.";
        setErrorMessage(message); 
        toast.error(message); 
      }
    } catch {
      const message = "We couldn't reach the sign-in service. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    } finally { 
      setIsLoading(false); 
    }
  }

  const fieldClass = "h-13 rounded-2xl border-slate-200 bg-slate-50 pl-11 pr-11 text-slate-900 text-base shadow-sm transition focus-visible:border-emerald-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-emerald-500/10";
  
  return <>
    <div className="mb-8"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-950 text-emerald-300 shadow-lg shadow-emerald-950/15"><KeyRound size={22} /></span><h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950">Sign in</h2><p className="mt-2 text-sm leading-6 text-slate-500">Your saved favourites and orders are waiting.</p></div>
    <AnimatePresence>{errorMessage && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</motion.div>}</AnimatePresence>
    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel className="text-sm font-bold text-slate-700">Email address</FormLabel><FormControl><div className="relative mt-2"><Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} /><Input type="email" autoComplete="email" placeholder="name@example.com" className={fieldClass} {...field} /></div></FormControl><FormMessage /></FormItem>} />
      <FormField control={form.control} name="password" render={({ field }) => <FormItem><div className="flex items-center justify-between"><FormLabel className="text-sm font-bold text-slate-700">Password</FormLabel><Link href="/forgot-password" className="text-xs font-bold text-emerald-700 hover:text-emerald-600">Forgot it?</Link></div><FormControl><div className="relative mt-2"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} /><Input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className={fieldClass} {...field} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></FormControl><FormMessage /></FormItem>} />
      
      <Button disabled={isLoading} type="submit" className="group mt-3 flex h-13 w-full items-center justify-center rounded-2xl bg-emerald-600 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:-translate-y-0.5 hover:bg-emerald-700">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            Continue <MoveRight className="transition-transform group-hover:translate-x-1" size={19} />
          </span>
        )}
      </Button>

    </form></Form>
    <p className="mt-7 text-center text-sm text-slate-500">New here? <Link href="/register" className="font-bold text-emerald-700 hover:text-emerald-600">Create your account</Link></p>
  </>;
}
