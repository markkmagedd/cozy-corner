"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CategorySidebarProps } from "@/src/types/product";
import CategorySidebar from "./CategorySidebar";

export default function MobileDrawer({ 
  categories, 
  activeCategoryId, 
  onSelectCategory,
  onCloseDrawer 
}: CategorySidebarProps) {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 left-0 w-80 bg-black border-r border-zinc-800 z-50 p-6 shadow-2xl overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">Categories</h2>
        <button 
          onClick={onCloseDrawer}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close categories"
        >
          <X size={24} />
        </button>
      </div>

      <CategorySidebar 
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(id) => {
          onSelectCategory(id);
          onCloseDrawer?.();
        }}
      />
    </motion.div>
  );
}

export const DrawerOverlay = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
  />
);
