"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/data";

type Project = (typeof projects)[number];

function VideoModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-9990 flex items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-4xl z-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-mono text-[10px] tracking-[3px] uppercase text-(--accent)">
                {project.type}
              </p>
              <p className="font-display text-[22px] tracking-[1px] md:text-[28px]">
                {project.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="font-mono text-[11px] tracking-[2px] uppercase text-(--muted) border border-(--border) px-4 py-2 hover:border-(--accent) hover:text-(--accent) transition-all duration-200"
            >
              Close ✕
            </button>
          </div>

          {/* Video iframe */}
          <div className="relative w-full border border-(--border)" style={{ aspectRatio: "16/9" }}>
            <iframe
              src={project.embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProjectCard({
  project,
  className,
  style,
  onClick,
}: {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`relative overflow-hidden border border-(--border) bg-(--surface) group cursor-pointer ${className}`}
      style={style}
      whileHover={{ borderColor: "var(--accent)" }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {/* Gradient placeholder */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${project.gradient} flex items-center justify-center font-display text-[48px] md:text-[56px] tracking-[8px] opacity-[0.18] select-none`}
      >
        ▶
      </div>

      {/* Play hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 rounded-full bg-(--accent) flex items-center justify-center shadow-[0_0_40px_rgba(255,60,0,0.4)]">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Overlay info */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6">
        <p className="font-mono text-[9px] md:text-[10px] tracking-[3px] uppercase text-(--accent) mb-1 md:mb-1.5">
          {project.type}
        </p>
        <p className="font-display text-[20px] md:text-[26px] tracking-[1px]">{project.title}</p>
      </div>
    </motion.div>
  );
}

export default function Work() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

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
              style={{ aspectRatio: "16/9" }}
              onClick={() => setActiveProject(project)}
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
              onClick={() => setActiveProject(project)}
            />
          ))}
        </div>
      </Reveal>

      {/* Video modal */}
      {activeProject && (
        <VideoModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </section>
  );
}