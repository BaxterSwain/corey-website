"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  firstName: string;
  lastName: string;
  badge: string;
  tagline: string;
  instagramUrl: string;
}

export default function HeroSection({
  firstName,
  lastName,
  badge,
  tagline,
  instagramUrl,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, 1 - scrollY / 700);
      const translateY = scrollY * 0.25;
      const scale = 1 + scrollY * 0.0002;
      container.style.opacity = String(opacity);
      container.style.transform = `translateY(${translateY}px) scale(${scale})`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-[#030303]"
    >
      {/* Cinematic background layers */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Radial vignette — deeper cinematic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 30%, #030303 80%)",
        }}
      />

      {/* Gold accent glow — subtle top center */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(212, 160, 84, 0.04) 0%, transparent 70%)",
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background:
            "linear-gradient(135deg, transparent 45%, rgba(212, 160, 84, 0.5) 50%, transparent 55%)",
        }}
      />

      {/* Left vertical accent */}
      <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#d4a054]/15 to-transparent" />

      {/* Letterbox bars for cinematic feel */}
      <div className="letterbox-top" />
      <div className="letterbox-bottom" />

      {/* Hero content */}
      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="flex flex-col items-start">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-8 h-px bg-[#d4a054]/60" />
            <span className="text-[#d4a054]/70 font-medium text-[11px] tracking-[0.35em] uppercase">
              {badge}
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[10vw] font-black leading-[0.82] tracking-[-0.04em]"
          >
            <span className="block text-white">{firstName}</span>
            <span className="block gradient-text">{lastName}</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 text-base sm:text-lg text-white/30 font-light max-w-lg leading-relaxed tracking-wide"
          >
            {tagline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex flex-wrap gap-5"
          >
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[#d4a054] hover:bg-[#e4b56a] text-[#030303] font-bold text-[11px] tracking-[0.2em] uppercase px-8 py-4 transition-all duration-400 hover:shadow-[0_0_40px_rgba(212,160,84,0.25)]"
            >
              <span className="flex items-center gap-3">
                Follow the Journey
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" />
                </svg>
              </span>
            </a>

            <button
              onClick={() =>
                document
                  .querySelector("#highlights")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border border-white/10 hover:border-[#d4a054]/40 text-white/40 hover:text-[#d4a054] font-medium text-[11px] tracking-[0.2em] uppercase px-8 py-4 transition-all duration-400"
            >
              Watch Highlights
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={scrollToAbout}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-white/15 hover:text-[#d4a054]/50 transition-colors duration-500 group"
        aria-label="Scroll down"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase font-medium">
          Scroll
        </span>
        <ChevronDown
          size={14}
          className="animate-bounce"
        />
      </motion.button>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#030303] to-transparent z-[1]" />
    </section>
  );
}
