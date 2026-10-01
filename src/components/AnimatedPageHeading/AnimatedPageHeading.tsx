"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AnimatedPageHeadingProps {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
}

export default function AnimatedPageHeading({ eyebrow, title, accent, subtitle }: AnimatedPageHeadingProps) {
  const reduceMotion = useReducedMotion();
  const words = title.split(" ");

  const wordVariants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 34, rotateX: -65, filter: "blur(9px)" },
    visible: reduceMotion
      ? { opacity: 1, transition: { duration: 0.25 } }
      : {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          transition: { type: "spring" as const, stiffness: 125, damping: 15 },
        },
  };

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      className="mb-11 max-w-2xl"
    >
      <motion.span
        initial={{ opacity: 0, y: 12, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm backdrop-blur"
      >
        <Sparkles size={16} />
        {eyebrow}
      </motion.span>

      <h1 className="mt-6 text-5xl font-black leading-[.95] tracking-[-.055em] text-slate-950 sm:text-6xl [perspective:900px]">
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={wordVariants}
            className="mr-[.2em] inline-block origin-bottom"
          >
            <motion.span
              animate={reduceMotion ? undefined : { x: [0, index % 2 ? -7 : 7, 0, index % 2 ? 7 : -7, 0] }}
              transition={{ duration: 4.8 + index * 0.3, delay: index * 0.12, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              {word === accent ? (
                <motion.span
                  animate={reduceMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="bg-gradient-to-r from-emerald-600 via-cyan-500 to-emerald-600 bg-[length:200%_auto] bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ) : word}
            </motion.span>
          </motion.span>
        ))}
      </h1>

      <div className="mt-5 h-1 w-24 overflow-hidden rounded-full bg-emerald-100">
        <motion.div
          initial={{ x: "-110%" }}
          animate={{ x: reduceMotion ? 0 : ["-110%", "0%", "110%"] }}
          transition={reduceMotion ? { duration: 0.25 } : { delay: 0.45, duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
          className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16, filter: reduceMotion ? "none" : "blur(6px)" }}
        animate={reduceMotion
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: [0, 1, 1, 1], y: [16, 0, 0, 0], x: [0, 7, -7, 0], filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(0px)"] }}
        transition={reduceMotion
          ? { duration: 0.25 }
          : { delay: 0.48, duration: 4.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.18, 0.68, 1] }}
        className="mt-4 inline-block text-lg leading-8 text-slate-600"
      >
        {subtitle}
      </motion.p>
    </motion.header>
  );
}
