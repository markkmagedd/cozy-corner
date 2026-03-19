"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative z-50 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b">
              {title && <h2 className="text-xl font-bold">{title}</h2>}
              <button
                onClick={onClose}
                className="absolute right-6 top-6 p-2 hover:bg-muted rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
