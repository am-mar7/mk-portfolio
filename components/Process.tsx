"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { processSteps } from "@/lib/data";

export default function Process() {
  return (
    <section className="px-5 py-16 bg-(--surface) border-y border-(--border) md:px-12 md:py-28">
      <Reveal>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <p className="font-mono text-[10px] tracking-[4px] uppercase text-(--accent) mb-4">
          // How I Work
        </p>
        <h2
          className="font-display leading-[0.93] mb-10 md:mb-16"
          style={{ fontSize: "clamp(40px, 8vw, 82px)" }}
        >
          MY
          <br />
          <span className="text-(--accent)">PROCESS</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex flex-col" style={{ gap: "2px" }}>
          {processSteps.map((step) => (
            <motion.div
              key={step.num}
              className="bg-(--bg) border border-(--border) group cursor-none"
              whileHover={{
                borderColor: "var(--accent)",
                backgroundColor: "rgba(255,60,0,0.025)",
              }}
              transition={{ duration: 0.18 }}
            >
              {/* Mobile layout: stacked */}
              <div className="flex items-start gap-5 p-6 md:hidden">
                <div className="font-display text-[36px] leading-none text-(--border) group-hover:text-[rgba(255,60,0,0.28)] transition-colors duration-300 shrink-0">
                  {step.num}
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-[22px] tracking-[1px] mb-1.5">{step.title}</h3>
                  <p className="text-[13px] leading-[1.65] text-(--muted)">{step.description}</p>
                </div>
              </div>

              {/* Desktop layout: 3-col grid */}
              <div
                className="hidden md:grid items-center gap-10 py-10 px-12"
                style={{ gridTemplateColumns: "80px 1fr auto" }}
              >
                <div className="font-display text-[46px] leading-none text-(--border) group-hover:text-[rgba(255,60,0,0.28)] transition-colors duration-300">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-display text-[27px] tracking-[1px] mb-2">{step.title}</h3>
                  <p className="text-[14px] leading-[1.65] text-(--muted)">{step.description}</p>
                </div>
                <div className="text-[22px] text-(--border) group-hover:text-(--accent) group-hover:translate-x-2 transition-all duration-200">
                  →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}