"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { LoginForm } from "./_Component/LoginForm/LoginForm";

const perks = [
  { icon: Truck, label: "Fast delivery, always" },
  { icon: ShieldCheck, label: "Protected payments" },
  { icon: Sparkles, label: "Members-only finds" },
];

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071a15] px-5 pb-12 pt-28 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:64px_64px]" />
      <motion.div animate={{ x: [0, 45, 0], y: [0, 28, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-28 top-24 h-96 w-96 rounded-full bg-emerald-400/25 blur-3xl" />
      <motion.div animate={{ x: [0, -36, 0], y: [0, -22, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.88fr] lg:gap-20">
        <motion.section initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-200 backdrop-blur"><Sparkles size={16} /> Your everyday, elevated</span>
          <h1 className="mt-7 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl lg:text-7xl">Welcome back to the <span className="text-emerald-300">good stuff.</span></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">Sign in to continue discovering the pieces, prices, and little surprises chosen for you.</p>
          <div className="mt-10 space-y-3">
            {perks.map(({ icon: Icon, label }, index) => <motion.div key={label} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.1 }} className="flex items-center gap-3 text-sm font-semibold text-slate-200"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300 text-emerald-950"><Icon size={19} /></span>{label}</motion.div>)}
          </div>
          <div className="mt-11 inline-flex items-center gap-2 text-sm text-slate-400">New to ShopMart? <a href="/register" className="group font-bold text-white">Create an account <ArrowUpRight size={15} className="inline transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-emerald-300/50 via-transparent to-cyan-300/40 blur-xl" />
          <div className="relative rounded-[1.9rem] border border-white/20 bg-white/[.96] p-6 shadow-2xl shadow-black/30 sm:p-9"><LoginForm /></div>
        </motion.section>
      </div>
    </main>
  );
}
