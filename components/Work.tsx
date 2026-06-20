"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Image from "next/image";
import { Project } from "@/lib/projects";

function ProjectCard({
  project,
  index,
  className,
  style,
}: {
  project: Project;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = project.thumbnail_url || "";

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl md:rounded-2xl border border-(--border) bg-(--surface) group ${className ?? ""}`}
      style={style}
      whileHover={!playing ? { y: -4, borderColor: "var(--accent)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {playing ? (
        /* ── Playing: show iframe inline ── */
        <>
          <iframe
            src={`${project.embed_url}${project.embed_url.includes("?") ? "&" : "?"}autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {/* Stop button */}
          <button
            onClick={() => setPlaying(false)}
            className="absolute top-2 right-2 z-10 font-mono text-[9px] tracking-[2px] uppercase bg-black/70 text-(--muted) border border-(--border) rounded-md px-3 py-1.5 hover:border-(--accent) hover:text-(--accent) transition-all duration-200"
          >
            ✕
          </button>
        </>
      ) : (
        /* ── Idle: show gradient + play button ── */
        <>
          {/* Thumbnail */}
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              unoptimized
            />
          )}
          {/* Gradient overlay always visible */}
          <div className={`absolute inset-0 bg-linear-to-br ${project.gradient} opacity-40 transition-opacity duration-500 group-hover:opacity-25`} />

          {/* Permanent subtle bottom shade so titles stay readable */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />

          {/* Index badge */}
          {typeof index === "number" && (
            <span className="absolute top-3 left-3 z-10 font-mono text-[9px] tracking-[2px] text-white/70 bg-black/40 backdrop-blur-sm border border-white/10 rounded-md px-2 py-1">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}

          {/* Play button */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={() => setPlaying(true)}
          >
            <div className="w-14 h-14 rounded-full bg-(--accent) flex items-center justify-center shadow-[0_0_40px_rgba(255,60,0,0.4)] scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Info overlay */}
          <div
            className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 cursor-pointer"
            onClick={() => setPlaying(true)}
          >
            <p className="font-mono text-[9px] md:text-[10px] tracking-[3px] uppercase text-(--accent) mb-1 md:mb-1.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              {project.type}
            </p>
            <p className="font-display text-[20px] md:text-[26px] leading-none tracking-[1px] translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              {project.title}
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}

type Row =
  | { kind: "verticals"; items: Project[] }
  | { kind: "pair"; v: Project; hs: Project[] }
  | { kind: "duo"; items: Project[] }
  | { kind: "full"; item: Project };

/**
 * Builds the collage layout following the orientation rule:
 *  - Zone A: standalone verticals  (count = V - floor(H/2)), 3 per row
 *  - Zone B: pairing rows = 1 vertical + 2 horizontals stacked  (floor(H/2) rows)
 *  - Odd horizontal leftover  -> full-width row
 *  - Fallback (H > 2V)        -> all verticals, then all horizontals
 * Returns the desktop row structure plus a flat mobile order.
 */
function buildLayout(projects: Project[]): { rows: Row[]; ordered: Project[] } {
  const verticals = projects.filter((p) => p.vertical);
  const horizontals = projects.filter((p) => !p.vertical);
  const V = verticals.length;
  const H = horizontals.length;

  const rows: Row[] = [];
  const ordered: Project[] = [];

  // Fallback: too many horizontals to pair — all verticals, then all horizontals.
  if (H > 2 * V) {
    for (let i = 0; i < V; i += 3) {
      rows.push({ kind: "verticals", items: verticals.slice(i, i + 3) });
    }
    for (let i = 0; i < H; i += 2) {
      const chunk = horizontals.slice(i, i + 2);
      if (chunk.length === 2) rows.push({ kind: "duo", items: chunk });
      else rows.push({ kind: "full", item: chunk[0] });
    }
    ordered.push(...verticals, ...horizontals);
    return { rows, ordered };
  }

  const pairCount = Math.floor(H / 2);
  const standaloneV = V - pairCount; // >= 0 because H <= 2V here

  // Zone A — standalone verticals, 3 per row
  const zoneA = verticals.slice(0, standaloneV);
  for (let i = 0; i < zoneA.length; i += 3) {
    rows.push({ kind: "verticals", items: zoneA.slice(i, i + 3) });
  }
  ordered.push(...zoneA);

  // Zone B — pairing rows: 1 vertical + 2 horizontals
  const pairVerts = verticals.slice(standaloneV); // length == pairCount
  for (let i = 0; i < pairCount; i++) {
    const v = pairVerts[i];
    const hs = horizontals.slice(i * 2, i * 2 + 2);
    rows.push({ kind: "pair", v, hs });
    ordered.push(v, ...hs);
  }

  // Odd leftover horizontal -> full-width row
  if (H % 2 === 1) {
    const last = horizontals[H - 1];
    rows.push({ kind: "full", item: last });
    ordered.push(last);
  }

  return { rows, ordered };
}

export default function Work({ projects = [] }: { projects: Project[] }) {
  const { rows, ordered } = buildLayout(projects);
  // Map project id -> display number (Hero is #1, so the grid starts at #2)
  const numberOf = new Map(ordered.map((p, i) => [p.id, i + 1]));

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

      {projects.length === 0 ? (
        <div className="border border-(--border) bg-(--surface) rounded-2xl py-16 text-center font-mono text-[10px] text-(--muted) tracking-widest uppercase">
          No projects uploaded yet
        </div>
      ) : (
        <Reveal delay={0.1}>
          {/* ── Mobile: 2-column collage in computed order ── */}
          <div className="grid grid-cols-2 gap-2.5 md:hidden">
            {ordered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={numberOf.get(project.id)}
                className={project.vertical ? "col-span-1 aspect-9/16" : "col-span-2 aspect-video"}
              />
            ))}
          </div>

          {/* ── Desktop: orientation-driven collage rows ── */}
          <div className="hidden md:flex md:flex-col gap-3">
            {rows.map((row, ri) => {
              if (row.kind === "verticals") {
                return (
                  <div key={ri} className="grid grid-cols-3 gap-3">
                    {row.items.map((p) => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        index={numberOf.get(p.id)}
                        className="aspect-9/16 w-full"
                      />
                    ))}
                  </div>
                );
              }

              if (row.kind === "pair") {
                return (
                  <div key={ri} className="flex gap-3 items-stretch">
                    {/* Vertical takes full row height */}
                    <div className="w-1/3 aspect-9/16">
                      <ProjectCard
                        project={row.v}
                        index={numberOf.get(row.v.id)}
                        className="h-full w-full"
                      />
                    </div>
                    {/* Two horizontals stacked, each half height */}
                    <div className="w-2/3 flex flex-col gap-3">
                      {row.hs.map((h) => (
                        <div key={h.id} className="flex-1 min-h-0">
                          <ProjectCard
                            project={h}
                            index={numberOf.get(h.id)}
                            className="h-full w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (row.kind === "duo") {
                return (
                  <div key={ri} className="grid grid-cols-2 gap-3">
                    {row.items.map((p) => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        index={numberOf.get(p.id)}
                        className="aspect-video w-full"
                      />
                    ))}
                  </div>
                );
              }

              // full
              return (
                <div key={ri}>
                  <ProjectCard
                    project={row.item}
                    index={numberOf.get(row.item.id)}
                    className="aspect-video w-full"
                  />
                </div>
              );
            })}
          </div>
        </Reveal>
      )}
    </section>
  );
}