'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createCategory, updateCategory } from '@/src/lib/actions/category-actions';
import { Database } from '@/src/types/database';
import { Layers, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type CategoryRow = Database['public']['Tables']['categories']['Row'];

interface CategoryFormProps {
  initialData?: CategoryRow;
  categories: CategoryRow[]; // To populate parent dropdown
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, categories, onSuccess, onCancel }: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      parent_id: null
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...data,
      parent_id: data.parent_id || null // Ensure null for no parent
    };

    try {
      const result = initialData 
        ? await updateCategory(initialData.id, payload)
        : await createCategory(payload);

      if (!result.success) {
        throw new Error(result.message);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="flex items-center justify-between border-b-2 border-muted pb-6">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-black">
          {initialData ? 'Edit' : 'Create'} <br /><span className="text-muted-foreground opacity-50">Category</span>
        </h2>
        <button 
          type="button" 
          onClick={onCancel}
          className="p-3 rounded-2xl bg-muted hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Category Name</label>
              <input 
                {...register('name', { required: true })} 
                placeholder="FOOTBALL WEAR"
                className="w-full h-16 px-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all"
              />
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Parent Category (Optional)</label>
              <select 
                {...register('parent_id')}
                className="w-full h-16 px-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all appearance-none"
              >
                <option value="">TOP-LEVEL CATEGORY</option>
                {categories
                   .filter(c => c.id !== initialData?.id) // Prevent self-parenting
                   .map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                ))}
              </select>
           </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="p-5 rounded-2xl bg-pastel-pink/20 border-2 border-pastel-pink/30 flex items-center gap-4 text-black font-black uppercase italic text-xs shadow-sm"
          >
            <AlertCircle className="w-5 h-5 opacity-50" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4 border-t-2 border-muted pt-12">
         <button 
           type="button" 
           onClick={onCancel}
           className="px-10 h-20 rounded-2xl border-4 border-muted hover:border-black transition-all text-sm font-black uppercase italic tracking-tighter"
         >
            Discard
         </button>
         <button 
           type="submit" 
           disabled={isSubmitting}
           className="flex-1 h-20 rounded-2xl bg-black text-white font-black uppercase italic tracking-tighter text-lg shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
         >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                 <Check className="w-6 h-6" /> Save Category To Universe
              </>
            )}
         </button>
      </div>
    </form>
  );
}
