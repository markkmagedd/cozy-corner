import prisma from "@/lib/prisma"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { AllCategoriesGrid } from "@/components/storefront/AllCategoriesGrid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop by Category | Cozy Corner",
  description: "Explore our curated collections of premium clothing and equipment.",
}

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  // Fetch top-level categories and include the first product's primary image
  const categoriesData = await prisma.category.findMany({
    where: { 
      parentId: null,
      // Optional: hide categories with no active products or strictly based on isActive 
      // if we had that field on Category. For now, following data-model.md
    },
    orderBy: { 
      displayOrder: 'asc' 
    },
    include: {
      products: {
        where: { isActive: true },
        take: 1,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1
          }
        }
      }
    }
  })

  // Format data for the grid component
  const categories = categoriesData.map(cat => {
    const firstProduct = cat.products[0]
    const primaryImage = firstProduct?.images[0]
    
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl || primaryImage?.url || null
    }
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-white">
        {/* Hero-like header for the categories page */}
        <div className="bg-slate-50 border-b border-slate-200 py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight">
              Our Collections
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover the finest selection of gear for your next journey, organized by category for your convenience.
            </p>
          </div>
        </div>

        {/* Categories Grid Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-7xl mx-auto px-4 md:px-8">
            <AllCategoriesGrid categories={categories} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
