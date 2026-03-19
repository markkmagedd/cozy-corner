"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface HeroBannerProps {
  headline: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroBanner({ headline, tagline, ctaText, ctaLink }: HeroBannerProps) {
  return (
    <section className="relative h-[600px] lg:h-[800px] w-full overflow-hidden bg-muted rounded-bl-3xl rounded-br-3xl flex flex-col justify-center items-center text-center p-6 lg:p-12 mb-20 bg-gradient-to-br from-pastel-green/50 via-white to-pastel-blue/30">
      <div className="absolute top-0 right-0 h-full w-2/3 bg-black/5 -skew-x-12 translate-x-1/2 blur-2xl" />
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl relative z-10 space-y-8"
      >
        <h1 className="text-6xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.9] text-black">
          {headline}
        </h1>
        
        <p className="text-xl lg:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
          {tagline}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-black text-white px-10 py-5 rounded-3xl font-black text-xl uppercase italic group flex items-center gap-4 mx-auto shadow-2xl"
        >
          {ctaText}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
      
      {/* Visual floating elements */}
      <motion.div 
        animate={{ y: [-15, 15, -15], x: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-20 hidden lg:block"
      >
        <div className="h-40 w-40 rounded-3xl bg-pastel-pink border-4 border-white shadow-xl rotate-12" />
      </motion.div>
      
      <motion.div 
        animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-40 hidden lg:block"
      >
        <div className="h-32 w-32 rounded-full bg-pastel-yellow border-4 border-white shadow-xl -rotate-12" />
      </motion.div>
    </section>
  );
}
