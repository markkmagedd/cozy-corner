"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { SearchBar } from "./SearchBar"
import { MegaMenu } from "./MegaMenu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
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
          <Link href="/admin/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none hover:bg-slate-100 hover:text-slate-900 h-9 px-3">
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}
