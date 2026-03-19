'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Menu, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-in-out",
        scrolled ? "bg-white/90 py-3 shadow-sm backdrop-blur-lg" : "bg-white py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Branding */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white transition-all group-hover:bg-neutral-800">
              <span className="text-xl font-black italic">H</span>
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-neutral-900 sm:block uppercase">Hotel Shop</span>
          </Link>
        </div>

        {/* Center: Search Placeholder (LC Waikiki style search bar) */}
        <div className="hidden max-w-md flex-1 px-8 lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="h-11 w-full rounded-full bg-neutral-100 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 text-neutral-700">
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 lg:hidden" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <button className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100 lg:flex" aria-label="Account">
            <User className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile/Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white p-8 shadow-2xl"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xl font-bold uppercase tracking-widest text-neutral-900">Explore</span>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-neutral-100 p-2 text-neutral-900 transition-colors hover:bg-neutral-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-8">
                {['Home', 'New Arrivals', 'Clothing', 'Souvenirs', 'About the Resort', 'Guest Services'].map((item) => (
                  <Link 
                    key={item} 
                    href="/" 
                    className="text-lg font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              <div className="absolute bottom-10 left-8 right-8 border-t pt-8">
                <p className="text-xs font-bold uppercase text-neutral-400">Available Daily</p>
                <p className="mt-1 text-sm text-neutral-600">8:00 AM - 10:00 PM</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
