"use client";

import { useRef, useState } from "react";
import { Play, Clock, Eye } from "lucide-react";
import { motion, useInView } from "framer-motion";

interface Highlight {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  views: string;
  videoUrl: string;
  gradient: string;
  badge: string;
  badgeColor: string;
  featured: number;
  order: number;
}

function VideoCard({
  video,
  index,
  onOpen,
}: {
  video: Highlight;
  index: number;
  onOpen: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video */}
      <div className="relative overflow-hidden aspect-video bg-[#080808] mb-5">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-cover"
          preload="metadata"
          muted
          playsInline
        />

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[#030303]/0 group-hover:bg-[#030303]/30 transition-all duration-500" />

        {/* Play button */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-400 ${
            hovered ? "opacity-100 scale-100" : "opacity-50 scale-90"
          }`}
          onClick={() => {
            if (!videoRef.current) return;

            if (videoRef.current.paused) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }}
        >
          <div className="w-14 h-14 border border-white/15 flex items-center justify-center group-hover:bg-[#d4a054] group-hover:border-[#d4a054] transition-all duration-400">
            <Play
              size={18}
              className="text-white fill-white ml-0.5"
              strokeWidth={0}
            />
          </div>
        </div>

        {/* Badge */}
        {video.badge && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#d4a054] text-[#030303] text-[8px] font-bold tracking-[0.2em] uppercase px-2.5 py-1">
              {video.badge}
            </span>
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white/70 text-[10px] font-mono px-2.5 py-1">
          {video.duration}
        </div>
      </div>

      {/* TEXT (click opens modal) */}
      <h3
        onClick={onOpen}
        className="cursor-pointer text-white font-bold text-sm leading-tight mb-1.5 group-hover:text-[#d4a054] transition-colors duration-300 line-clamp-2"
      >
        {video.title}
      </h3>

      <p className="text-white/25 text-xs leading-relaxed mb-3 line-clamp-2">
        {video.subtitle}
      </p>

      <div className="flex items-center gap-4 text-white/15 text-[10px]">
        <span className="flex items-center gap-1.5">
          <Clock size={10} />
          {video.duration}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={10} />
          {video.views}
        </span>
      </div>
    </motion.div>
  );
}

export default function HighlightsSection({
  highlights,
}: {
  highlights: Highlight[];
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.2 });

  const [activeVideo, setActiveVideo] = useState<Highlight | null>(null);

  return (
    <section
      id="highlights"
      className="relative py-32 lg:py-44 bg-[#050505] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-5xl font-black text-white">
            RACE <span className="text-[#d4a054]">FOOTAGE</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              onOpen={() => setActiveVideo(video)}
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={activeVideo.videoUrl}
              className="w-full rounded-lg"
              controls
              autoPlay
            />

            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 text-white"
            >
              ✕
            </button>

            <h3 className="text-white text-xl font-bold mt-4">
              {activeVideo.title}
            </h3>
          </div>
        </div>
      )}
    </section>
  );
}