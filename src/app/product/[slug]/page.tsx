import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
import { getProductBySlug } from "@/lib/actions/product-actions"
import { Navbar } from "@/components/storefront/Navbar"
import { Footer } from "@/components/storefront/Footer"
import { ProductInfo } from "@/components/storefront/product/ProductInfo"
import { VariantSelector } from "@/components/storefront/product/VariantSelector"
import { ProductGallery } from "@/components/storefront/product/ProductGallery"
import { getDefaultVariant } from "@/lib/variant-utils"

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
  const searchParams = await props.searchParams
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const colorParam = searchParams.color as string | undefined
  const sizeParam = searchParams.size as string | undefined

  const hasColorDimension = product.variants.some(v => v.color)
  const hasSizeDimension = product.variants.some(v => v.size)
  const anyAvailable = product.variants.some(v => v.isAvailable)

  // Redirect to default variant if current selection is invalid or missing
  if (anyAvailable) {
    const currentVariant = product.variants.find(v => 
      (!hasColorDimension || v.color === colorParam) && 
      (!hasSizeDimension || v.size === sizeParam) &&
      v.isAvailable
    )

    if (!currentVariant || (hasColorDimension && !colorParam) || (hasSizeDimension && !sizeParam)) {
      const defaultVariant = getDefaultVariant(product.variants)
      if (defaultVariant) {
        const params = new URLSearchParams()
        if (defaultVariant.color) params.set('color', defaultVariant.color)
        if (defaultVariant.size) params.set('size', defaultVariant.size)
        // Use replace to avoid polluting history with invalid param states
        redirect(`/product/${resolvedParams.slug}?${params.toString()}`)
      }
    }
  }

  const allOutOfStock = !anyAvailable

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
              
              {(hasColorDimension || hasSizeDimension) && (
                <>
                  <div className="w-full h-[1px] bg-slate-200"></div>
                  <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100 rounded-lg"></div>}>
                    <VariantSelector 
                      variants={product.variants} 
                      selectedColor={colorParam || null}
                      selectedSize={sizeParam || null}
                      allOutOfStock={allOutOfStock}
                    />
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
