"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface Photo {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  gradient: string;
  span: string;
  order: number;
}

function GalleryItem({
  photo,
  index,
  onClick,
}: {
  photo: Photo;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative overflow-hidden cursor-pointer ${photo.span} group`}
      style={{ aspectRatio: "1" }}
      onClick={onClick}
    >
      {/* Image or gradient */}
      {photo.imageUrl ? (
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${photo.gradient} transition-transform duration-700 group-hover:scale-110`}
        />
      )}

      {/* Hover overlay — cinematic dark with gold accent */}
      <div className="absolute inset-0 bg-[#030303]/0 group-hover:bg-[#030303]/75 flex flex-col items-start justify-end p-6 transition-all duration-400">
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-3 group-hover:translate-y-0">
          <span className="text-[#2a6dc7] text-[8px] font-bold tracking-[0.25em] uppercase">
            {photo.category}
          </span>
          <h4 className="text-white font-bold text-sm leading-tight mt-1.5">
            {photo.title}
          </h4>
        </div>
      </div>

      {/* Hover border — gold accent */}
      <div className="absolute inset-0 border border-transparent group-hover:border-[#2a6dc7]/20 transition-all duration-400" />
    </motion.div>
  );
}

export default function GallerySection({ photos }: { photos: Photo[] }) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.2 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % photos.length : null
        );
      if (e.key === "ArrowLeft")
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : null
        );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, photos.length]);

  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="relative py-32 lg:py-44 bg-[#030303] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#2a6dc7]/60" />
            <span className="text-[#2a6dc7]/60 font-medium text-[10px] tracking-[0.35em] uppercase">
              Gallery
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.85] tracking-[-0.03em]">
              <span className="text-white">THE</span>
              <br />
              <span className="gradient-text">MOMENTS</span>
            </h2>
            <p className="text-white/25 max-w-xs text-xs leading-relaxed">
              Captured at speed. Every photo tells the story of a racer who
              lives to compete.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[260px]">
          {photos.map((photo, i) => (
            <GalleryItem
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#030303]/95 backdrop-blur-md flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/30 hover:text-[#2a6dc7] transition-colors z-10"
              onClick={() => setLightboxIndex(null)}
            >
              <X size={28} />
            </button>

            <button
              className="absolute left-4 sm:left-8 text-white/30 hover:text-[#2a6dc7] transition-colors z-10 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (prev) => (prev! - 1 + photos.length) % photos.length
                );
              }}
            >
              <ChevronLeft size={36} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl mx-16 aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              {currentPhoto.imageUrl ? (
                <img
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${currentPhoto.gradient}`}
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-[#2a6dc7] text-[9px] font-bold tracking-[0.25em] uppercase">
                  {currentPhoto.category}
                </span>
                <h4 className="text-white font-bold text-xl mt-1.5">
                  {currentPhoto.title}
                </h4>
              </div>
            </motion.div>

            <button
              className="absolute right-4 sm:right-8 text-white/30 hover:text-[#2a6dc7] transition-colors z-10 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev! + 1) % photos.length);
              }}
            >
              <ChevronRight size={36} />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/20 text-xs font-mono tracking-wider">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
