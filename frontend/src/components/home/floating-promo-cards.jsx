"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingPromoCards() {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);

  // Left Card Data (Tech Internship)
  const leftCard = {
    badge: "College Students",
    title: "🚀 Tech Internship",
    description: "Work on real projects, receive mentorship, and build an industry-ready portfolio.",
    cta: "Apply Now →",
    href: "/career",
    image: "/assets/tech_internship_banner.png",
    alt: "College students in a software workspace collaborating on projects with laptops"
  };

  // Right Card Data (Future Skills Lab)
  const rightCard = {
    badge: "Classes 6–12 School Students",
    title: "⚡ Future Skills Lab",
    description: "AI, coding, robotics, digital literacy, and innovation programs for school students.",
    cta: "Explore →",
    href: "/future-skills",
    image: "/assets/future_skills_banner.png",
    alt: "School students learning robotics and AI coding in a classroom environment"
  };

  return (
    <>
      {/* ─── Desktop View: Floating side overlays ─── */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-30 overflow-hidden">
        
        {/* Left Floating Card */}
        <AnimatePresence>
          {showLeft && (
            <motion.div
              initial={{ opacity: 0, x: -150, y: "-50%" }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: ["-50%", "-52%", "-50%"],
                transition: {
                  x: { type: "spring", stiffness: 80, damping: 15 },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }
              }}
              exit={{ opacity: 0, x: -150, transition: { duration: 0.3 } }}
              className="absolute left-0 top-1/2 pointer-events-auto"
            >
              <motion.div
                initial={{ rotate: -2 }}
                whileHover={{ 
                  scale: 1.04, 
                  rotate: 0,
                  x: 12,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
                className="relative w-64 xl:w-72 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden -translate-x-8 transition-shadow duration-300"
              >
                {/* Dismiss Button */}
                <button
                  aria-label="Dismiss Tech Internship Card"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowLeft(false);
                  }}
                  className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-white text-slate-500 hover:text-slate-900 border border-slate-200/80 shadow-md hover:scale-110 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <Link href={leftCard.href} className="block group">
                  {/* Image banner */}
                  <div className="relative h-32 xl:h-36 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={leftCard.image}
                      alt={leftCard.alt}
                      fill
                      sizes="(max-width: 1280px) 256px, 288px"
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                  </div>

                  {/* Content area */}
                  <div className="p-5 text-left space-y-2.5">
                    <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50">
                      {leftCard.badge}
                    </span>
                    <h3 className="text-base xl:text-lg font-bold text-slate-900 leading-tight">
                      {leftCard.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {leftCard.description}
                    </p>
                    <span className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1.5 transition-transform duration-300">
                      {leftCard.cta}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Floating Card */}
        <AnimatePresence>
          {showRight && (
            <motion.div
              initial={{ opacity: 0, x: 150, y: "-50%" }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: ["-50%", "-48%", "-50%"],
                transition: {
                  x: { type: "spring", stiffness: 80, damping: 15 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }
              }}
              exit={{ opacity: 0, x: 150, transition: { duration: 0.3 } }}
              className="absolute right-0 top-1/2 pointer-events-auto"
            >
              <motion.div
                initial={{ rotate: 2 }}
                whileHover={{ 
                  scale: 1.04, 
                  rotate: 0,
                  x: -12,
                  transition: { type: "spring", stiffness: 400, damping: 20 }
                }}
                className="relative w-64 xl:w-72 bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden translate-x-8 transition-shadow duration-300"
              >
                {/* Dismiss Button */}
                <button
                  aria-label="Dismiss Future Skills Lab Card"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowRight(false);
                  }}
                  className="absolute top-3 left-3 z-30 w-7 h-7 rounded-full bg-white text-slate-500 hover:text-slate-900 border border-slate-200/80 shadow-md hover:scale-110 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <Link href={rightCard.href} className="block group">
                  {/* Image banner */}
                  <div className="relative h-32 xl:h-36 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={rightCard.image}
                      alt={rightCard.alt}
                      fill
                      sizes="(max-width: 1280px) 256px, 288px"
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                  </div>

                  {/* Content area */}
                  <div className="p-5 text-left space-y-2.5">
                    <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                      {rightCard.badge}
                    </span>
                    <h3 className="text-base xl:text-lg font-bold text-slate-900 leading-tight">
                      {rightCard.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {rightCard.description}
                    </p>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1.5 transition-transform duration-300">
                      {rightCard.cta}
                    </span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ─── Tablet & Mobile View: Inline below Hero text stack ─── */}
      <AnimatePresence>
        {(showLeft || showRight) && (
          <div className="lg:hidden w-full max-w-4xl px-2 mt-12 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              
              {/* Left Inline Card */}
              {showLeft && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden text-left"
                >
                  {/* Dismiss Button */}
                  <button
                    aria-label="Dismiss Tech Internship Card"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowLeft(false);
                    }}
                    className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-white/95 text-slate-500 hover:text-slate-900 border border-slate-200/80 shadow-md flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <Link href={leftCard.href} className="flex flex-row p-4 gap-4 items-center">
                    {/* Small Square Image */}
                    <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50">
                      <Image
                        src={leftCard.image}
                        alt={leftCard.alt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    {/* Compact content */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50">
                        {leftCard.badge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {leftCard.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {leftCard.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Right Inline Card */}
              {showRight && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group bg-white border border-slate-200 shadow-md rounded-2xl overflow-hidden text-left"
                >
                  {/* Dismiss Button */}
                  <button
                    aria-label="Dismiss Future Skills Lab Card"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowRight(false);
                    }}
                    className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-white/95 text-slate-500 hover:text-slate-900 border border-slate-200/80 shadow-md flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <Link href={rightCard.href} className="flex flex-row p-4 gap-4 items-center">
                    {/* Small Square Image */}
                    <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50">
                      <Image
                        src={rightCard.image}
                        alt={rightCard.alt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    {/* Compact content */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                        {rightCard.badge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {rightCard.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {rightCard.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
