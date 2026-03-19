import { notFound } from "next/navigation";
import { mockProducts } from "@/src/data/mock-product-data";
import { ProductDetails } from "@/src/components/products/ProductDetails";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/ui/Footer";
import { Product } from "@/src/types/product";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  
  const product = mockProducts.find((p: Product) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-1 bg-white text-black selection:bg-black/10">
        <div className="h-24 bg-white/80 border-b border-muted backdrop-blur-md sticky top-0 z-10 flex items-center px-6">
           <div className="max-w-7xl mx-auto w-full">
              <h2 className="text-xl font-black tracking-tighter italic uppercase text-muted-foreground opacity-30">
                 Catalog <span className="text-black ml-2 px-3 py-1 bg-black text-white rounded-lg not-italic">Detail</span>
              </h2>
           </div>
        </div>
        
        <ProductDetails product={product} />
      </main>

      <Footer />
    </div>
  );
}
