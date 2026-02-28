"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.42, 0, 0.58, 1] as const },
});

const SHOWREEL_URL = "https://drive.google.com/file/d/1PqUwFmCXWQDUBgAvMrV1Bcc5gw24jlG4/preview";

export default function Hero() {
  const [playing, setPlaying] = useState(false);

  return (
    <>
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
          {/* Video card — click to open modal */}
          <div
            className="scanlines relative overflow-hidden border border-(--border) bg-(--surface) cursor-pointer group"
            style={{ aspectRatio: "16 / 10" }}
            onClick={() => setPlaying(true)}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#181818] to-[#0c0c0c] flex items-center justify-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-(--accent) flex items-center justify-center animate-pulse-ring md:w-17.5 md:h-17.5"
                whileHover={{ scale: 1.1, boxShadow: "0 0 60px rgba(255,60,0,0.45)" }}
                transition={{ duration: 0.25 }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.75 md:w-5.5 md:h-5.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>

            {/* Hover hint */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="animate-progress absolute bottom-0 left-0 h-0.5 bg-(--accent)" />

            <span className="absolute bottom-3 left-3 font-mono text-[9px] tracking-[2px] uppercase text-(--muted) md:bottom-4 md:left-4 md:text-[10px]">
              Showreel 2024
            </span>
            <span className="absolute top-3 right-3 font-mono text-[11px] text-(--accent) md:top-4 md:right-4 md:text-[12px]">
              02:47
            </span>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 mt-px"
            style={{ gap: "1px", background: "var(--border)" }}
          >
            {[
              { val: "1+", label: "Yrs Exp." },
              { val: "6+", label: "Projects" },
              { val: "5+", label: "Clients" },
            ].map(({ val, label }) => (
              <div key={label} className="bg-(--surface) py-4 flex flex-col items-center md:py-5">
                <span className="font-display text-[28px] leading-none text-(--text) md:text-[36px]">
                  {val}
                </span>
                <span className="font-mono text-[9px] tracking-[2px] uppercase text-(--muted) mt-1 md:text-[10px]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Showreel Modal ── */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-9990 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/92 backdrop-blur-sm" />

            {/* Modal content */}
            <motion.div
              className="relative w-full max-w-4xl z-10"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-3">
                <div>
                   {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                  <p className="font-mono text-[9px] tracking-[3px] uppercase text-(--accent) md:text-[10px]">
                    // Showreel
                  </p>
                  <p className="font-display text-[20px] tracking-[1px] md:text-[26px]">
                    Mohamed Khaled · 2024
                  </p>
                </div>
                <button
                  onClick={() => setPlaying(false)}
                  className="font-mono text-[10px] tracking-[2px] uppercase text-(--muted) border border-(--border) px-4 py-2 hover:border-(--accent) hover:text-(--accent) transition-all duration-200"
                >
                  Close ✕
                </button>
              </div>

              {/* iframe */}
              <div
                className="relative w-full border border-(--border) bg-(--surface)"
                style={{ aspectRatio: "16 / 9" }}
              >
                <iframe
                  src={SHOWREEL_URL}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}