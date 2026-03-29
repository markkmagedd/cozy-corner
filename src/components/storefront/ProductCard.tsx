import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types"
import { formatPrice } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.primaryImage?.url || '/placeholder.svg'
  const altText = product.primaryImage?.altText || product.name

  return (
    <Link href={`/product/${product.slug}`} className="group block h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:border-accent/20">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={altText}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
            {product.brand}
          </p>
        )}
        <h3 className="font-semibold text-slate-900 group-hover:text-accent transition-colors flex-1">
          {product.name}
        </h3>
        
        <div className="mt-2 flex items-center justify-between">
          <p className="font-medium text-slate-900">
            {formatPrice(product.price)}
          </p>
          
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex gap-1">
              <span className="text-xs text-slate-500">{product.availableColors.length} colors</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
