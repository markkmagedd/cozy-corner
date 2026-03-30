import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export function HeroSection() {
  return (
    <div className="relative bg-primary overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/50 mix-blend-multiply" />
        {/* We would use next/image here with a real background if available */}
        <div className="w-full h-full bg-slate-800" />
      </div>

      <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center justify-center min-h-125">

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white max-w-4xl leading-tight">
          Discover the perfect <span className="text-accent">gear</span> for your next adventure.
        </h1>
        <p className="mt-6 text-xl text-slate-300 max-w-2xl leading-relaxed mx-auto">
          Premium clothing and equipment built to withstand the elements without compromising on style.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="#featured-categories" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-11 px-8 bg-white text-primary hover:bg-slate-100">
            Explore categories
          </Link>
        </div>
      </div>
    </div>

  )
}
