import { Category } from "@/src/types";
import { CategoryCard } from "./CategoryCard";
import Link from "next/link";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="container mx-auto px-4 py-20 bg-white">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-7xl font-black uppercase italic tracking-tighter text-black leading-none">
            Browse our <br /> Collections
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-xl">
            Everything you need for your active lifestyle from curated boutiques.
          </p>
        </div>
        <Link href="/products">
          <button className="px-8 py-4 border-2 border-black rounded-2xl font-bold hover:bg-black hover:text-white transition-all uppercase italic text-sm">
            View all 48 Categories
          </button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
