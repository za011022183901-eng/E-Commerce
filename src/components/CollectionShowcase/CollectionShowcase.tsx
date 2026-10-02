"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Layers3 } from "lucide-react";
import AnimatedPageHeading from "@/components/AnimatedPageHeading/AnimatedPageHeading";

type CollectionItem = { _id: string; name: string; slug?: string; image: string };

export default function CollectionShowcase({ items, kind }: { items: CollectionItem[]; kind: "brands" | "categories" }) {
  const isBrand = kind === "brands";
  const title = isBrand ? "Brands worth knowing." : "Find your next mood.";
  const subtitle = isBrand ? "A curated universe of names you already love—and the ones you are about to." : "Explore the collections that turn a quick browse into a great find.";
  const Icon = isBrand ? BadgeCheck : Layers3;

  return <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 px-5 pb-20 pt-28 sm:px-8 lg:px-12">
    <motion.div aria-hidden="true" animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(125deg,rgba(16,185,129,.07),transparent_35%,rgba(6,182,212,.08),transparent_75%)] bg-[length:200%_200%]" />
    <motion.div animate={{ x: [0, 60, 0], y: [0, 30, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -left-28 top-32 h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl" />
    <motion.div animate={{ x: [0, -50, 0], y: [0, -35, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="pointer-events-none absolute -right-24 top-64 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />
    <section className="relative mx-auto max-w-7xl">
      <AnimatedPageHeading
        eyebrow={isBrand ? "The ShopMart edit" : "Browse your way"}
        title={title}
        accent={isBrand ? "knowing." : "mood."}
        subtitle={subtitle}
      />
      <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: .055 } } }} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => <motion.article key={item._id} variants={{ hidden: { opacity: 0, y: 22, scale: .97 }, show: { opacity: 1, y: 0, scale: 1 } }} transition={{ duration: .42, ease: [0.22, 1, .36, 1] }} whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-[1.7rem] border border-white bg-white/80 p-3 shadow-[0_12px_35px_rgb(15,23,42,.08)] backdrop-blur">
          <Link href={`/${kind}/${item._id}`} className="block">
            <div className={`relative overflow-hidden rounded-[1.25rem] ${isBrand ? "aspect-square bg-slate-50 p-9" : "aspect-[4/4.8] bg-slate-100"}`}>
              <img src={item.image} alt={item.name} className={`h-full w-full transition duration-700 group-hover:scale-110 ${isBrand ? "object-contain mix-blend-multiply" : "object-cover"}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl bg-white/95 text-emerald-700 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100"><ArrowUpRight size={19} /></span>
            </div>
            <div className="flex items-end justify-between gap-3 px-2 pb-2 pt-5"><div><div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.16em] text-emerald-700"><Icon size={14} /> {isBrand ? "Brand" : "Collection"}</div><h2 className="line-clamp-1 text-xl font-black tracking-tight text-slate-900">{item.name}</h2><p className="mt-1 line-clamp-1 text-sm text-slate-500">{item.slug?.replaceAll("-", " ") || "Discover the collection"}</p></div><span className="mb-1 text-sm font-bold text-emerald-700">Explore</span></div>
          </Link>
        </motion.article>)}
      </motion.div>
    </section>
  </main>;
}
