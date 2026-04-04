import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/lib/actions/product-actions"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { ProductInfo } from "@/components/storefront/product/ProductInfo"
import { VariantSelector } from "@/components/storefront/product/VariantSelector"
import { ProductGallery } from "@/components/storefront/product/ProductGallery"

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(props: PageProps) {
  const resolvedParams = await props.params
  const product = await getProductBySlug(resolvedParams.slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | Cozy Corner`,
    description: product.description || `Buy ${product.name} online at Cozy Corner.`,
  }
}

export default async function ProductPage(props: PageProps) {
  const resolvedParams = await props.params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  // Format variant groups
  const colors = Array.from(new Set(product.variants.filter((v: any) => v.color).map((v: any) => v.color as string)))
  const sizes = Array.from(new Set(product.variants.filter((v: any) => v.size).map((v: any) => v.size as string)))
  
  const groups = []
  
  if (colors.length > 0) {
    groups.push({
      id: 'color',
      label: 'Color Options',
      options: colors.map(color => {
        const variant = product.variants.find((v: any) => v.color === color)
        return {
          value: color,
          colorHex: variant?.colorHex,
          isAvailable: product.variants.some((v: any) => v.color === color && v.isAvailable)
        }
      })
    })
  }

  if (sizes.length > 0) {
    groups.push({
      id: 'size',
      label: 'Size Options',
      options: sizes.map(size => {
         return {
           value: size,
           isAvailable: product.variants.some((v: any) => v.size === size && v.isAvailable)
         }
      })
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2">
              <ProductGallery images={product.images} />
            </div>
            
            <div className="w-full lg:w-1/2 flex flex-col gap-10">
              <ProductInfo product={product} />
              
              {groups.length > 0 && (
                <>
                  <div className="w-full h-[1px] bg-slate-200"></div>
                  <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100 rounded-lg"></div>}>
                    <VariantSelector groups={groups} />
                  </Suspense>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
