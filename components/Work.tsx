"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import { projects } from "@/lib/data";

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  className,
  style,
}: {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden border border-(--border) bg-(--surface) group ${className ?? ""}`}
      style={style}
      whileHover={!playing ? { borderColor: "var(--accent)" } : {}}
      transition={{ duration: 0.2 }}
    >
      {playing ? (
        /* ── Playing: show iframe inline ── */
        <>
          <iframe
            src={`${project.embedUrl}&autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Stop button */}
          <button
            onClick={() => setPlaying(false)}
            className="absolute top-2 right-2 z-10 font-mono text-[9px] tracking-[2px] uppercase bg-black/70 text-(--muted) border border-(--border) px-3 py-1.5 hover:border-(--accent) hover:text-(--accent) transition-all duration-200"
          >
            ✕
          </button>
        </>
      ) : (
        /* ── Idle: show gradient + play button ── */
        <>
          {/* Thumbnail */}
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          {/* Gradient overlay always visible */}
          <div className={`absolute inset-0 bg-linear-to-br ${project.gradient} opacity-40`} />

          {/* Play button */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => setPlaying(true)}
          >
            <div className="w-14 h-14 rounded-full bg-(--accent) flex items-center justify-center shadow-[0_0_40px_rgba(255,60,0,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Info overlay */}
          <div
            className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6 cursor-pointer"
            onClick={() => setPlaying(true)}
          >
            <p className="font-mono text-[9px] md:text-[10px] tracking-[3px] uppercase text-(--accent) mb-1 md:mb-1.5">
              {project.type}
            </p>
            <p className="font-display text-[20px] md:text-[26px] tracking-[1px]">{project.title}</p>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function Work() {
  return (
    <section id="work" className="px-5 py-16 md:px-12 md:py-28">
      <Reveal>
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <p className="font-mono text-[10px] tracking-[4px] uppercase text-(--accent) mb-4">
          // Selected Work
        </p>
        <h2
          className="font-display leading-[0.93] mb-10 md:mb-16"
          style={{ fontSize: "clamp(40px, 8vw, 82px)" }}
        >
          PROJECTS
          <br />
          <span className="text-(--accent)">THAT SPEAK</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        {/* Mobile: single column */}
        <div className="flex flex-col md:hidden" style={{ gap: "2px" }}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              style={{ aspectRatio: project.vertical ? "9/16" : "16/9" }}
            />
          ))}
        </div>

        {/* Desktop: asymmetric 12-col grid */}
        <div className="hidden md:grid grid-cols-12" style={{ gap: "2px" }}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              className={`${project.colSpan} ${project.aspect}`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}