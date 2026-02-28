"use client";

import { useEffect, useRef, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const ringPos = useRef({ x: -100, y: -100 });
  const [ringStyle, setRingStyle] = useState({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [data-hover]")) setHovered(true);
    };

    const onOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, [data-hover]")) setHovered(false);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    const animate = () => {
      ringPos.current.x += (target.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (target.current.y - ringPos.current.y) * 0.12;
      setRingStyle({ x: ringPos.current.x, y: ringPos.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        className="pointer-events-none fixed z-9999 rounded-full transition-[width,height,background] duration-150"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovered ? 18 : 10,
          height: hovered ? 18 : 10,
          background: hovered ? "var(--accent2)" : "var(--accent)",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Ring */}
      <div
        className="pointer-events-none fixed z-9998 rounded-full border border-[rgba(255,60,0,0.35)] transition-[width,height] duration-300"
        style={{
          left: ringStyle.x,
          top: ringStyle.y,
          width: hovered ? 56 : 38,
          height: hovered ? 56 : 38,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}