"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="px-5 py-16 md:px-12 md:py-28">
      <Reveal>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <p className="font-mono text-[10px] tracking-[4px] uppercase text-(--accent) mb-4">
          // Kind Words
        </p>
        <h2
          className="font-display leading-[0.93] mb-10 md:mb-16"
          style={{ fontSize: "clamp(40px, 8vw, 82px)" }}
        >
          CLIENT
          <br />
          <span style={{ WebkitTextStroke: "1px var(--text)", color: "transparent" }}>
            VOICES
          </span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        {/* Mobile: single col, md: 3-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gap: "2px" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="border border-(--border) bg-(--surface) p-7 md:p-10"
              whileHover={{ borderColor: "var(--accent)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-display text-[40px] leading-none text-(--accent) mb-3 md:text-[48px]">
                &ldquo;
              </div>
              <p className="text-[14px] leading-[1.8] text-(--muted) italic mb-7 md:text-[15px] md:mb-8">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-(--border) flex items-center justify-center font-display text-[15px] text-(--accent) shrink-0 md:w-10 md:h-10 md:text-[17px]">
                  {t.initial}
                </div>
                <div>
                  <div className="font-mono text-[10px] tracking-[2px] uppercase text-(--text) md:text-[11px]">
                    {t.name}
                  </div>
                  <div className="font-mono text-[9px] text-(--muted) mt-0.5 md:text-[10px]">
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}