import { mockCategories, mockProducts } from "@/src/data/mock-product-data";
import { CategorySidebar } from "@/src/components/layout/CategorySidebar";
import { ProductGrid } from "@/src/components/products/ProductGrid";
import { Pagination } from "@/src/components/products/Pagination";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/ui/Footer";
import { Product } from "@/src/types/product";
import { ChevronDown, Filter } from "lucide-react";

interface SearchParams {
  category?: string;
  page?: string;
  sort?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const currentCategory = params.category;
  const currentPage = parseInt(params.page || "1");
  const pageSize = 6;

  const filteredProducts = currentCategory 
    ? mockProducts.filter((p: Product) => p.categoryId === currentCategory)
    : mockProducts;

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-1 bg-white text-black font-sans selection:bg-black/10">
        {/* Decorative Hero Section - Subtler than the main hero */}
        <div className="relative h-48 bg-linear-to-br from-pastel-green/20 via-white to-pastel-blue/20 border-b border-muted flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-8">
            <nav className="text-xs text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
              Home <ChevronDown className="-rotate-90 w-3 h-3" /> Catalog
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Section */}
            <aside className="lg:w-70 shrink-0">
              <CategorySidebar 
                categories={mockCategories} 
                activeCategoryId={currentCategory} 
                baseUrl="/products" 
              />
            </aside>

            {/* Main Content Section */}
            <div className="flex-1 space-y-12">
              {/* Controls Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-8 gap-6">
                <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
                  Products <br /><span className="text-muted-foreground">Category</span>
                </h1>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-4 bg-muted border-none rounded-2xl text-sm font-bold text-black hover:bg-black hover:text-white transition-all uppercase italic">
                    <Filter className="w-4 h-4" />
                    <span>Sort By</span>
                    <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="min-h-150">
                <ProductGrid products={paginatedProducts} />
                
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/products"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
