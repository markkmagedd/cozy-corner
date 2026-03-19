import { getProducts } from "@/src/lib/actions/product-actions";
import { getCategories } from "@/src/lib/actions/category-actions";
import { CategorySidebar } from "@/src/components/layout/CategorySidebar";
import { ProductGrid } from "@/src/components/products/ProductGrid";
import { Pagination } from "@/src/components/products/Pagination";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/ui/Footer";
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
  const currentCategorySlug = params.category;
  const currentPage = parseInt(params.page || "1");
  const pageSize = 6;

  // 1. Fetch live data from Supabase
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // 2. Resolve Category ID from Slug if provided
  const activeCategory = categories.find(c => c.slug === currentCategorySlug);
  const activeCategoryId = activeCategory?.id;

  // 3. Filter Products
  const filteredProducts = activeCategoryId
    ? products.filter((p: any) => p.category_id === activeCategoryId)
    : products;

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
        {/* Decorative Hero Section */}
        <div className="relative h-48 bg-linear-to-br from-pastel-green/20 via-white to-pastel-blue/20 border-b border-muted flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-8">
            <nav className="text-xs text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2 font-bold">
              Home <ChevronDown className="-rotate-90 w-3 h-3" /> Catalog
            </nav>
            <p className="text-[10px] font-black uppercase tracking-widest text-black/20 italic">
               Universe / {activeCategory?.name || 'All Products'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Section */}
            <aside className="lg:w-70 shrink-0">
              <CategorySidebar 
                categories={categories as any} 
                activeCategoryId={currentCategorySlug} 
                baseUrl="/products" 
              />
            </aside>

            {/* Main Content Section */}
            <div className="flex-1 space-y-12">
              {/* Controls Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-8 gap-6">
                <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
                  Products <br /><span className="text-muted-foreground">{activeCategory?.name || 'Category'}</span>
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
                {paginatedProducts.length > 0 ? (
                  <>
                    <ProductGrid products={paginatedProducts as any} />
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      baseUrl="/products"
                    />
                  </>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                     <p className="text-4xl font-black italic uppercase text-muted-foreground opacity-20 tracking-tighter">No items found</p>
                     <p className="text-sm font-bold uppercase text-muted-foreground italic">Check back later for new arrivals</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
