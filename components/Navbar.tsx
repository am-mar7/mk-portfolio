"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = ["Work", "Services", "About", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:px-12 md:py-5 transition-all duration-300"
        style={{
          background: scrolled || menuOpen
            ? "rgba(8, 8, 8, 0.96)"
            : "linear-gradient(to bottom, rgba(8,8,8,0.88), transparent)",
          backdropFilter: scrolled || menuOpen ? "blur(14px)" : "none",
          borderBottom: scrolled || menuOpen ? "1px solid var(--border)" : "1px solid transparent",
        }}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-[20px] md:text-[22px] tracking-[3px] text-(--text) no-underline z-10"
        >
          MK<span className="text-(--accent)">.</span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:block">
          <ul className="flex gap-10 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  className="font-mono text-[11px] tracking-[2px] uppercase text-(--muted) no-underline hover:text-(--text) transition-colors duration-200"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <a
          href="https://wa.me/201205918704"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase no-underline px-5 py-2.5 bg-(--accent) text-(--bg) hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(255,60,0,0.45)] transition-all duration-200"
        >
          {/* WhatsApp icon */}
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Hire Me
        </a>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden z-10 flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <motion.span
            className="block h-px w-6 bg-(--text) origin-center"
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block h-px w-6 bg-(--text) origin-center"
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center items-center bg-(--bg) md:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <ul className="flex flex-col items-center gap-8 list-none m-0 p-0 mb-12">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.35 }}
                >
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={closeMenu}
                    className="font-display text-[52px] tracking-[3px] uppercase text-(--text) no-underline hover:text-(--accent) transition-colors duration-200"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/201205918704"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="font-mono text-[11px] tracking-[4px] uppercase text-(--accent) no-underline border border-(--accent) px-8 py-4 hover:bg-(--accent) hover:text-(--bg) transition-all duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.35 }}
            >
              Hire Me on WhatsApp
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}