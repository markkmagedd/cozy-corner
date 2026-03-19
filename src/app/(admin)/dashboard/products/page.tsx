'use client';

import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '@/src/lib/actions/product-actions';
import { Database } from '@/src/types/database';
import { createClient } from '@/src/lib/supabase/client';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Package, 
  ExternalLink,
  ChevronRight,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductForm } from '@/src/components/admin/ProductForm';

type ProductRow = Database['public']['Tables']['products']['Row'] & {
  categories: { name: string } | null;
};
type Category = Database['public']['Tables']['categories']['Row'];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [pData, { data: cData }] = await Promise.all([
      getProducts(),
      createClient().from('categories').select('*')
    ]);
    setProducts(pData as any);
    setCategories(cData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? image will remain in storage for now.')) {
      await deleteProduct(id);
      fetchData();
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-8 gap-6">
        <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-black">
          Products <br /><span className="text-muted-foreground">Catalog</span>
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={() => {setEditingProduct(null); setIsFormOpen(true);}}
            className="px-10 h-20 rounded-[1.5rem] bg-black text-white font-black italic uppercase tracking-tighter text-lg shadow-2xl shadow-black/10 hover:scale-[1.05] active:scale-[0.95] transition-transform flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" /> Add Product
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border-2 border-muted shadow-sm">
         <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-black transition-colors" />
            <input 
              placeholder="SEARCH BY NAME OR CATEGORY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-16 pr-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all shadow-inner"
            />
         </div>
         <div className="px-6 h-16 rounded-2xl bg-pastel-blue/20 flex items-center gap-4 text-xs font-black uppercase italic tracking-widest text-black/60 border-2 border-pastel-blue/10">
            <Package className="w-5 h-5 opacity-40" /> {filteredProducts.length} PRODUCTS FOUND
         </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6 text-muted-foreground opacity-30">
             <Loader2 className="w-12 h-12 animate-spin" />
             <p className="font-black uppercase italic tracking-widest text-xs">Syncing with universe...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="h-96 rounded-[3.5rem] bg-muted flex flex-col items-center justify-center gap-6 grayscale opacity-50 border-4 border-dashed border-muted-foreground/10 p-12 text-center">
             <Package className="w-16 h-16 text-muted-foreground" />
             <p className="text-2xl font-black italic tracking-tighter uppercase text-muted-foreground">No matching products found.</p>
             <button onClick={() => {setEditingProduct(null); setIsFormOpen(true);}} className="text-black font-black uppercase text-xs italic underline underline-offset-8">Create your first product</button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div 
              layout
              key={product.id}
              className="group p-6 rounded-[2.5rem] bg-muted border-2 border-transparent hover:border-black hover:bg-white transition-all shadow-sm flex items-center gap-8 relative overflow-hidden"
            >
               {/* Thumbnail */}
               <div className="w-32 h-32 rounded-3xl bg-white border-2 border-muted/50 overflow-hidden shrink-0 shadow-sm relative group-hover:scale-[1.05] transition-transform">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                       <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  {!product.in_stock && (
                    <div className="absolute inset-x-0 bottom-0 py-1.5 bg-pastel-pink text-black text-[8px] font-extrabold uppercase text-center italic tracking-widest">
                       Out of Stock
                    </div>
                  )}
               </div>

               {/* Info */}
               <div className="flex-1 min-w-0 py-2">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="px-3 py-1 rounded-full bg-pastel-blue/10 border border-pastel-blue/20 text-[10px] font-black uppercase tracking-widest italic text-black/50">
                        {product.categories?.name || 'Uncategorized'}
                     </span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">ID: {product.slug}</span>
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase text-black leading-none mb-4 group-hover:translate-x-1 transition-transform truncate">
                     {product.title}
                  </h3>
                  <p className="text-lg font-black italic text-black/40 leading-none tabular-nums">
                     ${product.price.toFixed(2)}
                     {product.original_price && (
                       <span className="text-sm line-through ml-3 opacity-30">${product.original_price.toFixed(2)}</span>
                     )}
                  </p>
               </div>

               {/* Actions */}
               <div className="flex items-center gap-4 py-2 pr-4">
                  <button 
                    onClick={() => {setEditingProduct(product); setIsFormOpen(true);}}
                    className="p-4 rounded-2xl bg-white border-2 border-muted hover:border-black hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                     <Edit3 className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-4 rounded-2xl bg-white border-2 border-muted hover:border-pastel-pink hover:bg-pastel-pink/20 hover:text-pastel-pink transition-all shadow-sm"
                  >
                     <Trash2 className="w-6 h-6" />
                  </button>
                  <a 
                    href={`/products/${product.slug}`} 
                    target="_blank"
                    className="p-4 rounded-2xl bg-white border-2 border-muted hover:border-black hover:bg-muted transition-all shadow-sm"
                  >
                     <ExternalLink className="w-6 h-6 text-muted-foreground" />
                  </a>
               </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Form Slide-over/Modal Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-white z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] overflow-y-auto scrollbar-none"
            >
               <div className="p-16">
                  <ProductForm 
                    initialData={editingProduct || undefined}
                    categories={categories}
                    onSuccess={() => {setIsFormOpen(false); fetchData();}}
                    onCancel={() => setIsFormOpen(false)}
                  />
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
