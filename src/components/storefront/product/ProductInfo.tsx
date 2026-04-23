import { Product } from "@/types"
import { formatPrice } from "@/lib/utils"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-serif font-bold text-slate-900">{product.name}</h1>
      <div className="flex items-center gap-4">
        <p className="text-2xl font-bold text-slate-900">{formatPrice(product.price)}</p>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <p className="text-lg text-slate-400 line-through">{formatPrice(product.compareAtPrice)}</p>
            <span className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-md">
              Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          </>
        )}
      </div>
      
      {product.description && (
        <div className="mt-4 prose prose-slate max-w-none text-slate-600 leading-relaxed">
          <p>{product.description}</p>
        </div>
      )}
    </div>
  )
}
