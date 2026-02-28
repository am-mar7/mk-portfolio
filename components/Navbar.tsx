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
          className="hidden md:inline-block font-mono text-[11px] tracking-[2px] uppercase text-(--accent) no-underline border border-(--accent) px-5 py-2 hover:bg-(--accent) hover:text-(--bg) transition-all duration-200"
        >
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