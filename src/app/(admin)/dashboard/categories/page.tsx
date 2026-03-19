'use client';

import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '@/src/lib/actions/category-actions';
import { Database } from '@/src/types/database';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Layers, 
  Loader2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryForm } from '@/src/components/admin/CategoryForm';

type CategoryRow = Database['public']['Tables']['categories']['Row'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await deleteCategory(id);
    if (res.success) {
      fetchData();
    } else {
      alert(res.message);
    }
  };

  const getParentName = (parentId: string | null) => {
    return categories.find(c => c.id === parentId)?.name;
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-8 gap-6">
        <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-black">
          Categories <br /><span className="text-muted-foreground">Hierarchy</span>
        </h1>
        <div className="flex gap-4">
          <button 
            onClick={() => {setEditingCategory(null); setIsFormOpen(true);}}
            className="px-10 h-20 rounded-[1.5rem] bg-black text-white font-black italic uppercase tracking-tighter text-lg shadow-2xl shadow-black/10 hover:scale-[1.05] transition-transform flex items-center justify-center gap-3"
          >
            <Plus className="w-6 h-6" /> Add Category
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-3xl border-2 border-muted">
         <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            <input 
              placeholder="SEARCH BY CATEGORY NAME..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-16 pr-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all"
            />
         </div>
         <div className="px-6 h-16 rounded-2xl bg-pastel-green/20 flex items-center gap-4 text-xs font-black uppercase italic tracking-widest text-black/60 border-2 border-pastel-green/10">
            <Layers className="w-5 h-5 opacity-40" /> {filteredCategories.length} CATEGORIES FOUND
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-6 text-muted-foreground opacity-30">
             <Loader2 className="w-12 h-12 animate-spin" />
             <p className="font-black uppercase italic tracking-widest text-xs">Syncing categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="h-96 rounded-[3.5rem] bg-muted flex flex-col items-center justify-center gap-6 border-4 border-dashed border-muted-foreground/10 text-center">
             <Layers className="w-16 h-16 text-muted-foreground opacity-30" />
             <p className="text-2xl font-black italic tracking-tighter uppercase text-muted-foreground opacity-30">The universe is empty.</p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const parentName = getParentName(category.parent_id);
            return (
              <motion.div 
                layout
                key={category.id}
                className="group p-6 rounded-[2.5rem] bg-muted border-2 border-transparent hover:border-black hover:bg-white transition-all shadow-sm flex items-center gap-8"
              >
                 <div className="w-16 h-16 rounded-2xl bg-white border-2 border-muted/50 flex items-center justify-center text-black/20 group-hover:bg-pastel-green group-hover:text-black transition-colors">
                    <Layers className="w-6 h-6" />
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Slug: {category.slug}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <h3 className="text-3xl font-black italic tracking-tighter uppercase text-black leading-none group-hover:translate-x-1 transition-transform truncate">
                          {category.name}
                       </h3>
                       {parentName && (
                         <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-[10px] font-black uppercase tracking-tighter text-black/40 italic">
                            Part of <ArrowRight className="w-3 h-3" /> {parentName}
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {setEditingCategory(category); setIsFormOpen(true);}}
                      className="p-4 rounded-2xl bg-white border-2 border-muted hover:border-black hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                       <Edit3 className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="p-4 rounded-2xl bg-white border-2 border-muted hover:border-pastel-pink hover:bg-pastel-pink/20 hover:text-pastel-pink transition-all shadow-sm"
                    >
                       <Trash2 className="w-6 h-6" />
                    </button>
                 </div>
              </motion.div>
            );
          })
        )}
      </div>

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
              className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
            >
               <div className="p-16">
                  <CategoryForm 
                    initialData={editingCategory || undefined}
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
