"use client";

import { useRef } from "react";
import { Flag, Zap, Trophy, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";

const iconMap: Record<string, LucideIcon> = { Flag, Zap, Trophy, Target };

interface AboutSectionProps {
  bio: string[];
  tags: string[];
  traits: { icon: string; title: string; desc: string }[];
  instagramUrl: string;
}

export default function AboutSection({ bio, tags, traits, instagramUrl }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 lg:py-44 bg-[#030303] overflow-hidden"
    >
      {/* Subtle background accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-[0.025]"
        style={{
          background:
            "radial-gradient(ellipse at 100% 30%, #d4a054 0%, transparent 60%)",
        }}
      />

      {/* Decorative corner lines */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-[#d4a054]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-start">
          {/* Left: bio */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Section label */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-[#d4a054]/60" />
              <span className="text-[#d4a054]/60 font-medium text-[10px] tracking-[0.35em] uppercase">
                About
              </span>
            </div>

            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.85] tracking-[-0.03em] mb-12">
              <span className="text-white">THE</span>
              <br />
              <span className="gradient-text">RACER</span>
            </h2>

            <div className="space-y-6 text-white/35 leading-[1.8] text-[15px]">
              {bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-12 flex flex-wrap gap-2.5">
              {tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                  className="border border-[#d4a054]/15 text-[#d4a054]/50 text-[9px] font-medium tracking-[0.2em] uppercase px-4 py-2 hover:border-[#d4a054]/40 hover:text-[#d4a054] transition-all duration-300"
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Follow link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-12 inline-flex items-center gap-3 text-[#d4a054] hover:text-[#e4b56a] font-medium text-[11px] tracking-[0.2em] uppercase transition-colors group"
            >
              <span className="w-6 h-px bg-[#d4a054]/40 group-hover:w-10 transition-all duration-300" />
              Follow the journey
              <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm">
                &rarr;
              </span>
            </a>
          </motion.div>

          {/* Right: trait cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {traits.map((trait, i) => {
              const Icon = iconMap[trait.icon] || Flag;
              return (
                <motion.div
                  key={trait.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative bg-white/[0.015] border border-white/[0.04] p-7 group transition-all duration-400 hover:bg-[#d4a054]/[0.03] hover:border-[#d4a054]/20 card-hover"
                >
                  <div className="mb-5 w-10 h-10 border border-[#d4a054]/20 flex items-center justify-center group-hover:border-[#d4a054]/40 transition-colors duration-300">
                    <Icon size={16} className="text-[#d4a054]/70" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2.5 tracking-wide">
                    {trait.title}
                  </h3>
                  <p className="text-white/25 text-xs leading-relaxed">
                    {trait.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
