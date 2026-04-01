"use client";

import { useRef, useState } from "react";
import { Mail, ExternalLink } from "lucide-react";
import { motion, useInView } from "framer-motion";

function InstagramIcon({ size = 20, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const inquiryTypes = [
  "Sponsorship Opportunities",
  "Media & Press",
  "Driving Appearances",
  "Brand Partnerships",
  "General Enquiries",
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);
    const body = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      enquiryType: formData.get("enquiryType") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitStatus("success");
      formRef.current?.reset();
    } catch {
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full bg-white/[0.02] border border-white/[0.06] focus:border-[#2a6dc7]/40 text-white placeholder-white/10 px-5 py-3.5 text-sm outline-none transition-all duration-300 focus:bg-white/[0.03]";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 lg:py-44 bg-[#050505] overflow-hidden"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2a6dc7]/20 to-transparent" />

      {/* Decorative corner */}
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-[#2a6dc7]/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#2a6dc7]/60" />
            <span className="text-[#2a6dc7]/60 font-medium text-[10px] tracking-[0.35em] uppercase">
              Contact
            </span>
            <div className="w-8 h-px bg-[#2a6dc7]/60" />
          </div>
          <h2 className="text-6xl sm:text-7xl lg:text-9xl font-black leading-[0.85] tracking-[-0.03em]">
            <span className="text-white">GET IN</span>
            <br />
            <span className="gradient-text">TOUCH</span>
          </h2>
          <p className="mt-8 text-white/25 max-w-md mx-auto text-sm leading-relaxed">
            Interested in sponsorship, media opportunities, or just want to
            follow the journey? Reach out.
          </p>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {/* Instagram */}
            <a
              href="https://www.instagram.com/coreymcculloughmotorsport/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-5 p-6 bg-white/[0.015] border border-white/[0.04] hover:border-[#2a6dc7]/20 hover:bg-[#2a6dc7]/[0.02] transition-all duration-400"
            >
              <div className="flex-shrink-0 w-11 h-11 border border-[#2a6dc7]/20 flex items-center justify-center group-hover:border-[#2a6dc7]/40 transition-colors duration-300">
                <InstagramIcon size={18} color="#2a6dc7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">Instagram</span>
                  <ExternalLink size={12} className="text-white/10 group-hover:text-[#2a6dc7]/50 transition-colors duration-300" />
                </div>
                <div className="text-[#2a6dc7]/70 text-xs mt-1">@coreymcculloughmotorsport</div>
                <div className="text-white/20 text-xs mt-1.5">Race updates, behind the scenes</div>
              </div>
            </a>

            {/* Email */}
            <button
              onClick={() => window.location.href = 'mailto:contact@coreymccullough.com'}
              className="w-full group flex items-start gap-5 p-6 bg-white/[0.015] border border-white/[0.04] hover:border-[#2a6dc7]/20 hover:bg-[#2a6dc7]/[0.02] transition-all duration-400 text-left cursor-pointer"
            >
              <div className="flex-shrink-0 w-11 h-11 border border-[#2a6dc7]/20 flex items-center justify-center group-hover:border-[#2a6dc7]/40 transition-colors duration-300">
                <Mail size={18} className="text-[#2a6dc7]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">Email</span>
                  <ExternalLink size={12} className="text-white/10 group-hover:text-[#2a6dc7]/50 transition-colors duration-300" />
                </div>
                <div className="text-[#2a6dc7]/70 text-xs mt-1">contact@coreymccullough.com</div>
                <div className="text-white/20 text-xs mt-1.5">Business & management enquiries</div>
              </div>
            </button>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#2a6dc7]/40 text-[9px] tracking-[0.25em] uppercase font-medium block mb-2.5">
                    First Name
                  </label>
                  <input type="text" name="firstName" required placeholder="John" className={inputClasses} />
                </div>
                <div>
                  <label className="text-[#2a6dc7]/40 text-[9px] tracking-[0.25em] uppercase font-medium block mb-2.5">
                    Last Name
                  </label>
                  <input type="text" name="lastName" required placeholder="Smith" className={inputClasses} />
                </div>
              </div>

              <div>
                <label className="text-[#2a6dc7]/40 text-[9px] tracking-[0.25em] uppercase font-medium block mb-2.5">
                  Email
                </label>
                <input type="email" name="email" required placeholder="john@company.com" className={inputClasses} />
              </div>

              <div>
                <label className="text-[#2a6dc7]/40 text-[9px] tracking-[0.25em] uppercase font-medium block mb-2.5">
                  Enquiry Type
                </label>
                <select name="enquiryType" className={`${inputClasses} appearance-none cursor-pointer`}>
                  <option value="">Select a category...</option>
                  {inquiryTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#0e0e0e]">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#2a6dc7]/40 text-[9px] tracking-[0.25em] uppercase font-medium block mb-2.5">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell Corey about your opportunity..."
                  className={`${inputClasses} resize-none`}
                />
              </div>

              {submitStatus === "success" && (
                <div className="text-[#2a6dc7] text-xs font-medium py-2">
                  Message sent. Corey will be in touch soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="text-red-400 text-xs font-medium py-2">
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#2a6dc7] hover:bg-[#3a7dd7] text-[#030303] font-bold text-[11px] tracking-[0.2em] uppercase py-4 transition-all duration-400 hover:shadow-[0_0_30px_rgba(212,160,84,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
