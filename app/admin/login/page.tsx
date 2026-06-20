"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-(--background) text-white flex items-center justify-center px-4">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-md bg-(--surface) border border-(--border) p-8 shadow-2xl z-10">
        {/* Accent strip */}
        <div className="absolute top-0 left-0 w-full h-0.75 bg-(--accent)" />

        <div className="mb-8">
          <p className="font-mono text-[10px] tracking-[4px] uppercase text-(--accent) mb-2">
            Access Protected Area
          </p>
          <h1 className="font-display text-4xl tracking-[1px]">ADMIN PORTAL</h1>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-[9px] tracking-[3px] uppercase text-(--muted) mb-2"
            >
              EMAIL ADDRESS
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="e.g. admin@portfolio.com"
              className="w-full bg-black/40 border border-(--border) px-4 py-3 font-sans text-sm focus:outline-none focus:border-(--accent) placeholder:text-(--muted) transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-[9px] tracking-[3px] uppercase text-(--muted) mb-2"
            >
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-black/40 border border-(--border) px-4 py-3 font-sans text-sm focus:outline-none focus:border-(--accent) placeholder:text-(--muted) transition-colors"
            />
          </div>

          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-500 font-mono text-[10px] tracking-[1px] uppercase">
              ✕ {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 flex items-center justify-center bg-(--accent) hover:bg-(--accent)/90 text-white font-mono text-[10px] tracking-[3px] uppercase font-bold disabled:opacity-50 cursor-pointer transition-colors"
          >
            {isPending ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
          </button>
        </form>
      </div>
    </div>
  );
}
