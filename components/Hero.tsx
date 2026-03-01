"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.42, 0, 0.58, 1] as const },
});

const SHOWREEL_ID = "FVwhrK4512o";
const SHOWREEL_EMBED = `https://www.youtube.com/embed/${SHOWREEL_ID}?rel=0&modestbranding=1`;

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center gap-10 px-5 pt-28 pb-16 overflow-hidden md:grid md:grid-cols-2 md:items-center md:gap-16 md:px-12 md:pt-32 md:pb-20">
      {/* Glow */}
      <div
        className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full md:-right-45 md:w-145 md:h-145"
        style={{ background: "radial-gradient(circle, rgba(255,60,0,0.07) 0%, transparent 70%)" }}
      />

      {/* ── Left content ── */}
      <div>
        <motion.p
          className="flex items-center gap-3 font-mono text-[10px] tracking-[3px] uppercase text-(--accent) mb-5 md:text-[11px] md:tracking-[4px] md:mb-6"
          {...fadeUp(0.15)}
        >
          <span className="block h-px w-8 bg-(--accent) md:w-10" />
          Video Editor · Available for work
        </motion.p>

        <motion.h1
          className="font-display leading-[0.91] tracking-[2px] mb-6 md:mb-8"
          style={{ fontSize: "clamp(56px, 12vw, 118px)" }}
          {...fadeUp(0.3)}
        >
          <span className="block">MOHAMED</span>
          <span className="block text-(--accent)">KHALED</span>
          <span
            className="block"
            style={{ WebkitTextStroke: "1px var(--text)", color: "transparent" }}
          >
            EDITS.
          </span>
        </motion.h1>

        <motion.p
          className="text-[14px] leading-[1.85] text-(--muted) max-w-sm mb-10 md:text-[15px] md:max-w-107.5 md:mb-12"
          {...fadeUp(0.45)}
        >
          A passionate video editor crafting compelling visual stories through motion, rhythm, and
          emotion. Transforming raw footage into unforgettable cinematic experiences.
        </motion.p>

        <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6" {...fadeUp(0.6)}>
          <a
            href="#work"
            className="bg-(--accent) text-(--bg) font-mono text-[11px] tracking-[2px] uppercase px-8 py-4 no-underline text-center hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(255,60,0,0.28)] transition-all duration-200 md:px-9 md:py-3.75"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="font-mono text-[11px] tracking-[2px] uppercase text-(--muted) no-underline hover:text-(--text) transition-colors duration-200 group flex items-center gap-2 justify-center sm:justify-start"
          >
            Get in touch
            <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </motion.div>
      </div>

      {/* ── Right: Reel card ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
      >
        {/* Inline video — no modal, plays right here */}
        <div className="mx-auto md:max-w-75">
          <div
            className="relative overflow-hidden border border-(--border) bg-(--surface)"
            style={{ aspectRatio: "9 / 16" }}
          >
            <iframe
              src={SHOWREEL_EMBED}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="Mohamed Khaled Showreel 2024"
            />
          </div>

          {/* Latest project label */}
          <div className="mt-3 px-1 flex items-start gap-3 border-t border-(--border) pt-3">
            <span className="font-mono text-[9px] tracking-[3px] uppercase text-(--accent) mt-0.5 shrink-0">
              Latest
            </span>
            <p className="font-mono text-[11px] leading-[1.6] text-(--muted)">
              Zidane — a cinematic short edit celebrating one of football&apos;s greatest icons,
              blending archival footage with dynamic color grading and motion graphics.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}