import { notFound } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { ProductDetails } from "@/src/components/products/ProductDetails";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/ui/Footer";

interface ProductPageProps {
  params: Promise<{
    productId: string; // This is actually the SLUG
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId: slug } = await params;
  
  // Fetch product by slug from Prisma
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: { name: true }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Map Prisma product back to frontend-friendly structure
  const mappedProduct = {
    ...product,
    id: product.id,
    title: product.title,
    description: product.description || '',
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    inStock: product.inStock,
    categoryName: product.category?.name || 'Uncategorized'
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black/10">
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="h-24 bg-white/80 border-b-2 border-muted backdrop-blur-md sticky top-0 z-10 flex items-center px-6">
           <div className="max-w-7xl mx-auto w-full">
              <h2 className="text-xl font-black tracking-tighter italic uppercase text-muted-foreground opacity-30">
                 Catalog <span className="text-black ml-2 px-4 py-1.5 bg-black text-white rounded-xl not-italic shadow-lg shadow-black/10">Detail</span>
              </h2>
           </div>
        </div>
        
        <ProductDetails product={mappedProduct as any} />
      </main>

      <Footer />
    </div>
  );
}
