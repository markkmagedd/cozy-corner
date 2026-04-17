"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <div className="relative h-[calc(100vh-var(--nav-height))] min-h-[600px] w-full overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg-beach.png"
          alt="Premium Boutique Store Interior"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Advanced Overlay: Dark gradient for legibility */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-primary/60 to-primary/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase text-accent bg-accent/10 rounded-full border border-accent/20">
            Elevated Essentials
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] tracking-tight">
            Elevate your <br />
            <span className="text-accent italic">daily</span> experience.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed mx-auto font-light">
            Discover our curated collection of premium clothing and equipment, 
            designed for those who appreciate the finer details of modern life.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
            <Link 
              href="/categories" 
              className="inline-flex items-center justify-center rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 h-14 px-10 bg-accent text-white hover:bg-accent/90 hover:scale-105 shadow-xl shadow-accent/20 active:scale-95"
            >
              Explore Collection
            </Link>
            
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-linear-to-b from-accent to-transparent" />
      </motion.div>
    </div>
  )
}
