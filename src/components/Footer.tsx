"use client";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#030303] border-t border-[#2a6dc7]/8">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2a6dc7]/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-14">
          {/* Brand */}
          <div className="flex flex-col gap-5 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#2a6dc7]/40 flex items-center justify-center">
                <span className="text-[#2a6dc7] font-black text-[11px]">CM</span>
              </div>
              <div>
                <div className="text-white font-black text-[13px] tracking-[0.2em] leading-none">
                  COREY McCULLOUGH
                </div>
                <div className="text-[#2a6dc7]/30 text-[9px] tracking-[0.35em] leading-none mt-1">
                  MOTORSPORT
                </div>
              </div>
            </div>
            <p className="text-white/15 text-xs leading-relaxed">
              Professional motorsport racer. Born to compete, driven by passion.
            </p>
            <a
              href="https://www.instagram.com/coreymcculloughmotorsport/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/20 hover:text-[#2a6dc7] text-xs transition-colors duration-300"
            >
              <InstagramIcon size={14} />
              @coreymcculloughmotorsport
            </a>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-16">
            <div>
              <h4 className="text-[#2a6dc7]/25 text-[9px] tracking-[0.35em] uppercase font-medium mb-5">
                Navigate
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Home", href: "#hero" },
                  { label: "About", href: "#about" },
                  { label: "Highlights", href: "#highlights" },
                  { label: "Gallery", href: "#gallery" },
                  { label: "Contact", href: "#contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-white/20 hover:text-[#2a6dc7] text-xs transition-colors duration-300 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[#2a6dc7]/25 text-[9px] tracking-[0.35em] uppercase font-medium mb-5">
                Follow
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://www.instagram.com/coreymcculloughmotorsport/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/20 hover:text-[#2a6dc7] text-xs transition-colors duration-300"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[#2a6dc7]/25 text-[9px] tracking-[0.35em] uppercase font-medium mb-5">
                Business
              </h4>
              <ul className="space-y-3">
                {["Sponsorship", "Media", "Appearances"].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => scrollTo("#contact")}
                      className="text-white/20 hover:text-[#2a6dc7] text-xs transition-colors duration-300 cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-white/[0.03] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-white/10 text-xs">
            &copy; {currentYear} Corey McCullough Motorsport
          </p>
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 bg-[#2a6dc7] rounded-full animate-pulse" />
            <span className="text-[#2a6dc7]/30 text-[9px] tracking-[0.25em] uppercase font-medium">
              Season Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
