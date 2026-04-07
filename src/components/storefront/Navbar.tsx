"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { SearchBar } from "./SearchBar"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl transition-all duration-300">
      <div className="container flex h-[var(--nav-height)] items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-8 h-full">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-slate-100/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity">
              Cozy Corner
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-2 h-full">
            <Link 
              href="/categories" 
              className="text-sm font-semibold tracking-wide text-primary/80 hover:text-accent transition-all duration-200 h-10 px-4 py-2 flex items-center rounded-full hover:bg-slate-100/50"
            >
              Categories
            </Link>
            <Link 
              href="/?search=new" 
              className="text-sm font-semibold tracking-wide text-primary/80 hover:text-accent transition-all duration-200 h-10 px-4 py-2 flex items-center rounded-full hover:bg-slate-100/50"
            >
              New Arrivals
            </Link>
            <Link 
              href="/?search=sale" 
              className="text-sm font-semibold tracking-wide text-primary/80 hover:text-accent transition-all duration-200 h-10 px-4 py-2 flex items-center rounded-full hover:bg-slate-100/50"
            >
              Offers
            </Link>
            <Link 
              href="#footer" 
              className="text-sm font-semibold tracking-wide text-primary/80 hover:text-accent transition-all duration-200 h-10 px-4 py-2 flex items-center rounded-full hover:bg-slate-100/50"
            >
              Contact Us
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-6 flex-1 md:flex-initial justify-end">
          <div className="hidden md:flex w-full max-w-sm">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 top-[var(--nav-height)] z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200/50 overflow-hidden w-full h-[calc(100vh-var(--nav-height))] flex flex-col"
          >
            <div className="p-6 space-y-8 h-full overflow-y-auto">
              <div className="w-full">
                <SearchBar />
              </div>
              <nav className="flex flex-col gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Explore</h3>
                  <Link href="/" className="flex items-center justify-between group p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-accent/20 transition-all font-bold text-primary">
                    Home
                  </Link>
                  <Link href="/categories" className="flex items-center justify-between group p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-accent/20 transition-all font-bold text-primary">
                    Categories
                  </Link>
                  <Link href="/?search=new" className="flex items-center justify-between group p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-accent/20 transition-all font-bold text-primary">
                    New Arrivals
                  </Link>
                  <Link href="/?search=sale" className="flex items-center justify-between group p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-accent/20 transition-all font-bold text-primary">
                    Offers
                  </Link>
                  <Link href="#footer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between group p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-accent/20 transition-all font-bold text-primary">
                    Contact Us
                  </Link>
                </div>
              </nav>
            </div>
            
            <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/30">
              <p className="text-sm text-center text-slate-500 font-medium italic">
                Elevating your daily experience.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
