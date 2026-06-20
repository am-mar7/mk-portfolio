"use client";

import React, { useState, useTransition } from "react";
import { Project } from "@/lib/projects";
import { saveProjectAction, deleteProjectAction, logoutAction } from "./actions";

// Accent gradients preset library
const GRADIENT_PRESETS = [
  { name: "Violet Darkness", value: "from-[#0a001a] via-[#1a0033] to-[#0a0010]" },
  { name: "Sunset Fire", value: "from-[#1a0a00] via-[#3d1500] to-[#1a0000]" },
  { name: "Deep Oceanic", value: "from-[#000d1a] via-[#001533] to-[#000a1a]" },
  { name: "Eclipse Obsidian", value: "from-[#000d1a] via-[#001020] to-[#00080f]" },
  { name: "Volcanic Magma", value: "from-[#160600] via-[#2a0d00] to-[#120500]" },
  { name: "Emerald Cyber", value: "from-[#001a0d] via-[#00331a] to-[#001005]" },
  { name: "True Black", value: "from-neutral-950 via-neutral-900 to-neutral-950" },
];

const COL_SPAN_OPTIONS = [
  { label: "Quarter Width (1/4)", value: "col-span-3" },
  { label: "Third Width (1/3)", value: "col-span-4" },
  { label: "Half Width (1/2)", value: "col-span-6" },
  { label: "Two-Thirds (2/3)", value: "col-span-8" },
  { label: "Full Width (1/1)", value: "col-span-12" },
];

const ASPECT_OPTIONS = [
  { label: "Vertical Aspect (9:16)", value: "aspect-[9/16]" },
  { label: "Horizontal Aspect (16:9)", value: "aspect-video" },
  { label: "Square Aspect (1:1)", value: "aspect-square" },
];

export default function DashboardClient({ initialProjects }: { initialProjects: Project[] }) {
  const projects = initialProjects;
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [vertical, setVertical] = useState(true);
  const [colSpan, setColSpan] = useState("col-span-4");
  const [aspect, setAspect] = useState("aspect-[9/16]");
  const [gradient, setGradient] = useState(GRADIENT_PRESETS[0].value);
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);

  // Open modal for writing new project
  const handleNewProject = () => {
    setEditingProject(null);
    setTitle("");
    setType("");
    setEmbedUrl("");
    setThumbnailUrl("");
    setVertical(true);
    setColSpan("col-span-4");
    setAspect("aspect-[9/16]");
    setGradient(GRADIENT_PRESETS[0].value);
    setSortOrder(projects.length > 0 ? Math.max(...projects.map(p => p.sort_order)) + 1 : 1);
    setPublished(true);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing project
  const handleEditProject = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setType(p.type);
    setEmbedUrl(p.embed_url);
    setThumbnailUrl(p.thumbnail_url || "");
    setVertical(p.vertical);
    setColSpan(p.col_span);
    setAspect(p.aspect);
    setGradient(p.gradient);
    setSortOrder(p.sort_order);
    setPublished(p.published);
    setStatusMessage(null);
    setIsModalOpen(true);
  };

  // Smart toggle handler for vertical orientation presets
  const handleOrientationChange = (isVertical: boolean) => {
    setVertical(isVertical);
    if (isVertical) {
      setAspect("aspect-[9/16]");
      setColSpan("col-span-4");
    } else {
      setAspect("aspect-video");
      setColSpan("col-span-6");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type.trim() || !embedUrl.trim()) {
      setStatusMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    const payload = {
      title,
      type,
      embed_url: embedUrl.trim(),
      thumbnail_url: thumbnailUrl.trim(),
      vertical,
      col_span: colSpan,
      aspect,
      gradient,
      sort_order: Number(sortOrder),
      published,
    };

    startTransition(async () => {
      const result = await saveProjectAction(editingProject?.id || null, payload);
      if (result.error) {
        setStatusMessage({ type: "error", text: result.error });
      } else {
        setStatusMessage({ type: "success", text: "Project saved successfully!" });
        
        // Refresh local state list mockingly, or let reload handle it
        setTimeout(() => {
          setIsModalOpen(false);
          window.location.reload();
        }, 800);
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project "${name}"?`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProjectAction(id);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        window.location.reload();
      }
    });
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <div className="min-h-screen bg-(--background) text-white font-sans pb-24">
      {/* Header section */}
      <header className="border-b border-(--border) bg-black/40 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-[4px] uppercase text-(--muted)"> PORTFOLIO CONTROLLER</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleNewProject}
            className="font-mono text-[9px] tracking-[2px] uppercase bg-(--accent) hover:bg-(--accent)/90 text-white px-5 py-2.5 font-bold cursor-pointer transition-colors"
          >
            + ADD PROJECT
          </button>
          <button
            onClick={handleLogout}
            className="font-mono text-[9px] tracking-[2px] uppercase border border-(--border) hover:border-red-500/50 hover:text-red-500 text-(--muted) px-4 py-2.5 cursor-pointer transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="font-display text-5xl md:text-6xl tracking-[1px] leading-tight">DASHBOARD</h1>
            <p className="font-mono text-xs text-(--muted) tracking-wider mt-1"> Manage client proofing, layout grids and details</p>
          </div>
          <div className="font-mono text-[11px] bg-(--surface) border border-(--border) px-4 py-2 text-(--muted)">
            Total Uploads: <span className="text-white font-bold">{projects.length}</span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="border border-(--border) bg-(--surface) py-20 text-center font-mono text-xs text-(--muted) tracking-widest uppercase">
            Your production portfolio is empty. Click &quot;+ Add Project&quot; to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div 
                key={p.id} 
                className={`relative border flex flex-col justify-between p-6 ${p.published ? "bg-(--surface) border-(--border)" : "bg-(--surface)/30 border-dashed border-red-500/20"}`}
              >
                {!p.published && (
                  <span className="absolute top-3 right-3 font-mono text-[8px] bg-red-950/80 border border-red-500/30 text-red-400 px-2 py-0.5 tracking-wider uppercase">
                    DRAFT
                  </span>
                )}
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono text-[9px] text-(--accent) tracking-[2px] uppercase mb-1">{p.type}</p>
                      <h3 className="font-display text-2xl tracking-[0.5px] truncate max-w-50">{p.title}</h3>
                    </div>
                    <div className="bg-black/30 border border-(--border) px-2 py-1 font-mono text-[9px] text-(--muted)">
                      Order: <strong className="text-white">{p.sort_order}</strong>
                    </div>
                  </div>

                  {/* Thumbnail / Mock player preview */}
                  <div className="relative aspect-video bg-black/60 border border-(--border) mb-4 overflow-hidden group">
                    {p.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-(--muted)">NO THUMBNAIL</div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={p.embed_url} target="_blank" rel="noreferrer" className="bg-black/85 border border-(--border) p-2 text-[9px] font-mono tracking-widest text-white hover:border-(--accent) transition-colors">
                        TEST VIDEO ↗
                      </a>
                    </div>
                  </div>

                  {/* Grid attributes tags */}
                  <div className="space-y-1.5 mb-6">
                    <div className="flex justify-between text-[10px] font-mono border-b border-(--border)/30 pb-1">
                      <span className="text-(--muted)">Orientation</span>
                      <span className="text-white">{p.vertical ? "Vertical (9:16)" : "Horizontal (16:9)"}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono border-b border-(--border)/30 pb-1">
                      <span className="text-(--muted)">Span Width</span>
                      <span className="text-white">{p.col_span}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono border-b border-(--border)/30 pb-1">
                      <span className="text-(--muted)">Aspect Ratio</span>
                      <span className="text-white">{p.aspect}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-(--border)/40 pt-4">
                  <button
                    onClick={() => handleEditProject(p)}
                    className="flex-1 font-mono text-[9px] tracking-[1.5px] uppercase border border-(--border) hover:border-(--accent) text-white hover:text-(--accent) py-2 cursor-pointer transition-colors text-center"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="font-mono text-[9px] tracking-[1.5px] uppercase border border-(--border) hover:border-red-500/40 hover:text-red-400 text-neutral-400 py-2 px-3 cursor-pointer transition-colors"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Slideout Modal/Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-(--surface) border-l border-(--border) h-full overflow-y-auto p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-(--border)">
                <div>
                  <p className="font-mono text-[9px] tracking-[3px] text-(--accent) uppercase">EDIT PROJECT DEETS</p>
                  <h2 className="font-display text-4xl tracking-wide">{editingProject ? "EDIT PROJECT" : "ADD NEW WORK"}</h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 border border-(--border) text-(--muted) hover:text-white hover:border-(--accent) font-mono text-[10px]"
                >
                  ✕ CLOSE
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                    PROJECT TITLE (Required)
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. iPhone 15 Ad Campaign"
                    className="w-full bg-black/30 border border-(--border) px-4 py-2.5 font-sans text-xs focus:outline-none focus:border-(--accent)"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                    PROJECT TYPE (Required)
                  </label>
                  <input
                    type="text"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Commercial / Music Video / VFX Showreel"
                    className="w-full bg-black/30 border border-(--border) px-4 py-2.5 font-sans text-xs focus:outline-none focus:border-(--accent)"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                    YOUTUBE EMBED URL (Required)
                  </label>
                  <input
                    type="url"
                    required
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/XXXXXXXX?rel=0"
                    className="w-full bg-black/30 border border-(--border) px-4 py-2.5 font-sans text-xs focus:outline-none focus:border-(--accent)"
                  />
                  <p className="text-[8px] font-mono text-(--muted) mt-1 uppercase">Use standard youtube embed format for responsive features</p>
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                    THUMBNAIL IMAGE URL (Optional override)
                  </label>
                  <input
                    type="text"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="e.g. https://domain.com/custom-photo.jpg"
                    className="w-full bg-black/30 border border-(--border) px-4 py-2.5 font-sans text-xs focus:outline-none focus:border-(--accent)"
                  />
                  <p className="text-[8px] font-mono text-(--muted) mt-1 uppercase">Leave blank to extract thumbnail image automatically from YouTube URL</p>
                </div>

                {/* Grid Sizing Controls */}
                <div className="border border-(--border) p-4 bg-black/10 space-y-4">
                  <span className="block text-[9px] font-mono tracking-[2px] uppercase text-(--accent) mb-2">
                    Layout Grid Configurations
                  </span>

                  <div>
                    <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-2">
                      ORIENTATION & PRESETS
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleOrientationChange(true)}
                        className={`py-2 font-mono text-[9px] tracking-wider uppercase border cursor-pointer ${vertical ? "bg-(--accent)/10 border-(--accent) text-white" : "border-(--border) text-neutral-400 hover:border-white"}`}
                      >
                        Vertical (9:16)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOrientationChange(false)}
                        className={`py-2 font-mono text-[9px] tracking-wider uppercase border cursor-pointer ${!vertical ? "bg-(--accent)/10 border-(--accent) text-white" : "border-(--border) text-neutral-400 hover:border-white"}`}
                      >
                        Horizontal (16:9)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                        GRID WIDTH SPAN
                      </label>
                      <select
                        value={colSpan}
                        onChange={(e) => setColSpan(e.target.value)}
                        className="w-full bg-black/40 border border-(--border) px-3 py-2 font-mono text-[9px]"
                      >
                        {COL_SPAN_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                        ASPECT RATIO
                      </label>
                      <select
                        value={aspect}
                        onChange={(e) => setAspect(e.target.value)}
                        className="w-full bg-black/40 border border-(--border) px-3 py-2 font-mono text-[9px]"
                      >
                        {ASPECT_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                      SORT ORDER PRIORITY
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full bg-black/30 border border-(--border) px-4 py-2 font-mono text-xs focus:outline-none focus:border-(--accent)"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono tracking-[2px] uppercase text-(--muted) mb-1">
                      GLOW OVERLAY GRADIENT
                    </label>
                    <select
                      value={gradient}
                      onChange={(e) => setGradient(e.target.value)}
                      className="w-full bg-black/30 border border-(--border) px-3 py-2.5 font-mono text-[9px]"
                    >
                      {GRADIENT_PRESETS.map((preset) => (
                        <option key={preset.value} value={preset.value}>{preset.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-3.5 h-3.5 accent-(--accent) bg-black/30 border border-(--border)"
                  />
                  <label htmlFor="published" className="text-[10px] font-mono tracking-[2px] uppercase text-white cursor-pointer select-none">
                    PUBLISHED (ACTIVE ON MAIN SITE)
                  </label>
                </div>

                {statusMessage && (
                  <div className={`border p-3 font-mono text-[9px] tracking-[1px] uppercase ${statusMessage.type === "success" ? "bg-green-500/10 border-green-500/25 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-500"}`}>
                    {statusMessage.type === "success" ? "✓" : "✕"} {statusMessage.text}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-12 flex items-center justify-center bg-(--accent) hover:bg-(--accent)/90 text-white font-mono text-[10px] tracking-[3px] uppercase font-bold disabled:opacity-50 cursor-pointer"
                  >
                    {isPending ? "SAVING IN BACKGROUND..." : "SAVE PROJECT"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
