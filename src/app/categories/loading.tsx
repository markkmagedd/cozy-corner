import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        {/* Header Skeleton */}
        <div className="bg-slate-50 border-b border-slate-200 py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center">
            <Skeleton className="h-12 md:h-16 w-64 md:w-96 mb-6" />
            <Skeleton className="h-6 w-full max-w-2xl mb-2" />
            <Skeleton className="h-6 w-3/4 max-w-lg" />
          </div>
        </div>

        {/* Categories Grid Skeleton */}
        <section className="py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-2xl shadow-sm" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
