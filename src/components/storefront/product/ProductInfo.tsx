import type { Product } from "@prisma/client"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-serif font-bold text-slate-900">{product.name}</h1>
      <p className="text-2xl font-medium text-slate-800">${product.price.toFixed(2)}</p>
      
      {product.description && (
        <div className="mt-4 prose prose-slate max-w-none text-slate-600 leading-relaxed">
          <p>{product.description}</p>
        </div>
      )}
    </div>
  )
}
