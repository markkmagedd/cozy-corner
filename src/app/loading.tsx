import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <div className="relative bg-slate-900 overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="max-w-2xl">
              <Skeleton className="h-4 w-32 bg-slate-800 mb-6" />
              <Skeleton className="h-16 w-3/4 bg-slate-800 mb-6" />
              <Skeleton className="h-6 w-full bg-slate-800 mb-8" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32 bg-slate-800" />
                <Skeleton className="h-12 w-32 bg-slate-800" />
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Skeleton className="h-10 w-48 mb-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Featured Categories Skeleton */}
        <div className="bg-slate-50 py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-64 mb-10 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl shadow-sm" />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
