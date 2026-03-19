import { Product } from "@/src/types";
import { ProductCard } from "./ProductCard";

interface DealsSectionProps {
  products: Product[];
  isLoading?: boolean;
}

export function DealsSection({ products, isLoading = false }: DealsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-20 pb-40">
      <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
        <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter text-black leading-none">
          Today's best <br /> deals for you!
        </h2>
        <button className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-black border-b-2 border-transparent hover:border-black py-2 transition-all">
          Explore all best deals
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {isLoading 
          ? Array.from({ length: 5 }).map((_, i) => <ProductCard key={i} product={{} as Product} isLoading />) 
          : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        }
      </div>
    </section>
  );
}
