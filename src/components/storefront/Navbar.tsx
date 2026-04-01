"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { SearchBar } from "./SearchBar"
import { MegaMenu } from "./MegaMenu"

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
            Cozy Corner
          </Link>
          <div className="hidden md:flex ml-6">
            <MegaMenu />
          </div>
        </div>
        
        <div className="flex items-center gap-4 flex-1 md:flex-initial justify-end">
          <div className="hidden md:flex w-full max-w-sm">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-white border-t border-slate-200 overflow-y-auto w-full h-[calc(100vh-4rem)] p-4 flex flex-col gap-6">
          <div className="w-full">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-4 text-lg font-medium">
            <Link href="/" className="hover:text-accent transition-colors py-2 border-b border-slate-100">
              Home
            </Link>
            <Link href="/categories" className="hover:text-accent transition-colors py-2 border-b border-slate-100">
              All Categories
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
