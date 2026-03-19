"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Category } from "@/src/types";
import { cn } from "@/src/lib/utils";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group h-[240px] md:h-[300px] w-full rounded-3xl p-8 flex flex-col justify-between cursor-pointer relative overflow-hidden transition-shadow hover:shadow-2xl hover:shadow-black/5",
        category.pastelColorClass
      )}
    >
      <div className="flex justify-between items-start z-10">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none text-black break-words max-w-[150px]">
          {category.name}
        </h3>
        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight className="w-6 h-6" />
        </div>
      </div>
      
      {/* Icon/Image Placeholder */}
      <div className="absolute -bottom-8 -right-8 opacity-20 group-hover:opacity-40 transition-all duration-500 transform group-hover:-translate-y-4 group-hover:-translate-x-4">
        <div className="h-40 w-40 bg-black/10 rounded-full blur-2xl" />
      </div>
      
      <div className="self-end z-10 font-bold uppercase tracking-widest text-xs py-2 px-4 bg-white/40 backdrop-blur-sm rounded-full">
        Explore
      </div>
    </motion.div>
  );
}
