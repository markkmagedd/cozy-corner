import Link from "next/link"
import { Button } from "@/components/ui/Button"

export function PromoBanner() {
  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 sm:px-12 sm:py-24 lg:flex lg:items-center lg:gap-x-20 lg:px-24">
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary via-primary to-accent/20 opacity-90" />
          
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:text-left">
            <h2 className="text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl">
              Equip your next <br />great adventure.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Get 15% off your first purchase when you explore our new seasonal equipment collection. Performance meets purpose.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Link href="/category/equipment">
                <Button className="bg-white text-primary hover:bg-slate-100 h-12 px-8 text-base">
                  Shop Equipment
                </Button>
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-white hover:text-accent transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="relative mt-16 h-80 lg:mt-8 flex-1 flex items-center justify-center">
            {/* Abstract visual element */}
            <div className="w-64 h-64 rounded-full bg-linear-to-tr from-accent/40 to-white/10 blur-3xl animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative w-72 h-48 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl transform rotate-3 flex items-center justify-center">
                  <span className="text-white/20 font-serif italic text-2xl uppercase tracking-widest">Cozy Corner</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
