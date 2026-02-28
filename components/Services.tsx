"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { services } from "@/lib/data";

export default function Services() {
  return (
    <section
      id="services"
      className="px-5 py-16 bg-(--surface) border-y border-(--border) md:px-12 md:py-28"
    >
      <Reveal>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <p className="font-mono text-[10px] tracking-[4px] uppercase text-(--accent) mb-4">
          // What I Do
        </p>
        <h2
          className="font-display leading-[0.93] mb-10 md:mb-16"
          style={{ fontSize: "clamp(40px, 8vw, 82px)" }}
        >
          SERVICES
          <br />
          <span style={{ WebkitTextStroke: "1px var(--text)", color: "transparent" }}>
            OFFERED
          </span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        {/* Mobile: single col, Desktop: 2-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "2px" }}>
          {services.map((service) => (
            <motion.div
              key={service.num}
              className="relative overflow-hidden border border-(--border) bg-(--bg) p-8 group cursor-none md:p-12"
              whileHover={{ borderColor: "var(--accent)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Left accent bar */}
              <div className="absolute top-0 left-0 w-0.75 bg-(--accent) h-0 group-hover:h-full transition-all duration-500 ease-out" />

              <div className="font-display text-[52px] leading-none mb-4 text-(--border) group-hover:text-[rgba(255,60,0,0.14)] transition-colors duration-300 md:text-[72px] md:mb-6">
                {service.num}
              </div>
              <h3 className="font-display text-[24px] tracking-[1px] mb-3 md:text-[30px] md:mb-4">
                {service.title}
              </h3>
              <p className="text-[13px] leading-[1.85] text-(--muted) md:text-[14px]">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-5 md:mt-6">
                {service.tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-mono text-[9px] tracking-[2px] uppercase px-2.5 py-1 border border-(--border) text-(--muted) md:text-[10px] md:px-3"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}