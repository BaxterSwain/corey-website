"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  id: number;
  value: number;
  suffix: string;
  label: string;
}

function CountUp({
  target,
  suffix,
  started,
}: {
  target: number;
  suffix: string;
  started: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2200;
    const steps = 70;
    const increment = target / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [started, target]);

  return (
    <span className="stat-number">
      {count}
      {suffix}
    </span>
  );
}

export default function StatsBanner({ stats }: { stats: StatItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView) setStarted(true);
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 bg-[#050505] overflow-hidden"
    >
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a054]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-5xl sm:text-6xl lg:text-5xl xl:text-6xl font-black text-white leading-none mb-3 group-hover:text-[#d4a054] transition-colors duration-500">
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  started={started}
                />
              </div>
              <div className="text-white/20 text-[9px] tracking-[0.3em] uppercase font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
