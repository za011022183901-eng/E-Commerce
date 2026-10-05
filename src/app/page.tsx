"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";

const benefits = [
  { icon: Truck, title: "Fast delivery", text: "Your favorites, moving fast." },
  { icon: ShieldCheck, title: "Secure checkout", text: "Simple, safe payments every time." },
  { icon: Sparkles, title: "Curated picks", text: "Products selected to delight." },
];

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pt-36">
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <section className="mx-auto grid max-w-screen-2xl items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: "easeOut" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm backdrop-blur"><Sparkles size={16} /> Shop smarter, live better</span>
          <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[.98] tracking-[-.06em] text-slate-950 sm:text-6xl lg:text-8xl">A better way to find your <span className="text-emerald-600">next favorite.</span></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Discover technology, fashion, beauty, and everyday essentials in one joyful shopping destination.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="shine-on-hover group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-slate-950 dark:bg-emerald-600 px-6 font-bold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-600 dark:hover:bg-emerald-500">Explore products <ArrowRight size={19} className="transition-transform group-hover:translate-x-1" /></Link>
            <Link href="/categories" className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/90 px-6 font-bold text-slate-800 dark:text-slate-100 shadow-sm backdrop-blur transition hover:border-emerald-300 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400">Browse categories</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }} className="relative mx-auto w-full max-w-xl">
          <div className="motion-float relative overflow-hidden rounded-[2.4rem] border border-white/80 bg-slate-950 p-7 shadow-2xl shadow-emerald-950/20 sm:p-9">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/30 blur-3xl" /><div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl" />
            <div className="relative"><p className="text-sm font-bold uppercase tracking-[.24em] text-emerald-300">The everyday edit</p><h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">Fresh finds.<br />Zero fuss.</h2><div className="mt-10 grid grid-cols-2 gap-3"><div className="rounded-3xl bg-white p-5 text-slate-950 shadow-lg"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</p><p className="mt-2 text-3xl font-black">6+</p><p className="mt-1 text-sm text-slate-500">Ways to explore</p></div><div className="rounded-3xl bg-emerald-400 p-5 text-emerald-950 shadow-lg"><p className="text-xs font-bold uppercase tracking-wider text-emerald-900/60">Checkout</p><p className="mt-2 text-3xl font-black">Easy</p><p className="mt-1 text-sm text-emerald-950/70">Cash or card</p></div></div></div>
          </div>
          <div className="absolute -bottom-6 -left-4 rounded-2xl border border-white bg-white/90 px-5 py-4 shadow-xl backdrop-blur sm:-left-10"><p className="text-sm font-black text-slate-900">Made for your day</p><p className="mt-0.5 text-sm text-slate-500">Discover. Save. Enjoy.</p></div>
        </motion.div>
      </section>
      <section className="mx-auto mt-20 grid max-w-screen-2xl gap-5 md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }, index) => (<motion.article key={title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.1 }} className="rounded-3xl border border-slate-200/80 bg-white/75 p-7 shadow-sm backdrop-blur"><div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Icon size={24} /></div><h2 className="text-xl font-black text-slate-900">{title}</h2><p className="mt-1 text-base leading-7 text-slate-500">{text}</p></motion.article>))}</section>
    </main>
  );
}