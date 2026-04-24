import { Suspense } from "react"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { CategoryContent } from "@/components/storefront/CategoryContent"
import { CategoryLowerSkeleton } from "@/components/storefront/CategoryLowerSkeleton"
import { CategoryHeader } from "@/components/storefront/CategoryHeader"
import { Skeleton } from "@/components/ui/Skeleton"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // These are fast as they come from the router
  const { slug } = await params
  const resolvedSP = await searchParams

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Category Header Section - Suspended independently */}
        <Suspense fallback={
          <div className="bg-slate-50 py-12 border-b border-slate-200">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-64" />
                  <Skeleton className="h-20 w-full max-w-xl" />
                </div>
                <Skeleton className="w-full lg:w-[400px] aspect-[4/3] rounded-2xl" />
              </div>
            </div>
          </div>
        }>
          <CategoryHeader slug={slug} />
        </Suspense>
        
        {/* Lower Content Section - Loaded asynchronously with Suspense */}
        <Suspense key={slug + JSON.stringify(resolvedSP)} fallback={<CategoryLowerSkeleton />}>
          <CategoryContent slug={slug} resolvedSP={resolvedSP} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
