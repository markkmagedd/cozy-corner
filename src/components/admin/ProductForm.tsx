'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadProductImage } from '@/src/lib/supabase/storage';
import { createProduct, updateProduct } from '@/src/lib/actions/product-actions';
import { Database } from '@/src/types/database';
import { ShoppingBag, Upload, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type Category = Database['public']['Tables']['categories']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];

interface ProductFormProps {
  initialData?: ProductRow;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ initialData, categories, onSuccess, onCancel }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      price: 0,
      original_price: null,
      category_id: '',
      sizes: [],
      in_stock: true
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image exceeds the 5MB limit.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setError(null);

    try {
      let finalImageUrl = initialData?.image_url || '';

      // 1. Upload new image if selected
      if (imageFile) {
        finalImageUrl = await uploadProductImage(imageFile);
      }

      const productPayload = {
        ...data,
        image_url: finalImageUrl,
        // Convert prices to numbers
        price: Number(data.price),
        original_price: data.original_price ? Number(data.original_price) : null,
      };

      // 2. Create or Update in DB via Server Actions
      const result = initialData 
        ? await updateProduct(initialData.id, productPayload)
        : await createProduct(productPayload);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(initialData ? 'Product updated successfully' : 'Product created successfully');
      onSuccess();
    } catch (err: any) {
      const msg = err.message || 'Operation failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b-2 border-muted pb-6">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-black">
          {initialData ? 'Edit' : 'Create'} <br /><span className="text-muted-foreground opacity-50">Product</span>
        </h2>
        <button 
          type="button" 
          onClick={onCancel}
          className="p-3 rounded-2xl bg-muted hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Col: Imagery */}
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic mb-2 block">
            Product Imagery (MAX 5MB)
          </label>
          <div className="relative aspect-square rounded-[3rem] bg-muted border-4 border-dashed border-muted-foreground/20 overflow-hidden group hover:border-black/20 transition-all shadow-inner flex flex-col items-center justify-center p-8">
            {imagePreview ? (
              <>
                <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button type="button" onClick={() => {setImageFile(null); setImagePreview(null);}} className="p-4 rounded-full bg-white text-black font-black uppercase italic text-xs scale-90 group-hover:scale-100 transition-transform flex items-center gap-2">
                      <X className="w-4 h-4" /> Replace Image
                   </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-[2rem] bg-white border-2 border-muted/50 flex items-center justify-center mx-auto text-muted-foreground shadow-sm">
                   <Upload className="w-8 h-8" />
                </div>
                <p className="text-sm font-black italic text-muted-foreground uppercase tracking-tighter">
                   Drag or Click to Upload
                </p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Product Title</label>
              <input 
                {...register('title', { required: true })} 
                placeholder="VINTAGE BARCELONA SHIRT"
                className="w-full h-16 px-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Current Price ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  {...register('price', { required: true })} 
                  placeholder="29.99"
                  className="w-full h-16 px-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Original Price ($)</label>
                <input 
                   type="number"
                   step="0.01"
                  {...register('original_price')} 
                  placeholder="39.99"
                  className="w-full h-16 px-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all"
                />
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Category</label>
              <select 
                {...register('category_id', { required: true })}
                className="w-full h-16 px-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all appearance-none"
              >
                <option value="">SELECT A CATEGORY</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                ))}
              </select>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Description</label>
              <textarea 
                {...register('description')} 
                rows={4}
                placeholder="PREMIUM COTTON BLEND WITH STRATEGIC VENTILATION..."
                className="w-full p-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-xs uppercase italic transition-all resize-none"
              />
           </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
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
           className="px-10 h-20 rounded-[1.5rem] border-4 border-muted hover:border-black active:scale-95 transition-all text-sm font-black uppercase italic tracking-tighter"
         >
            Discard
         </button>
         <button 
           type="submit" 
           disabled={isSubmitting}
           className="flex-1 h-20 rounded-[1.5rem] bg-black text-white font-black uppercase italic tracking-tighter text-lg shadow-2xl shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
         >
            {isSubmitting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                 <Check className="w-6 h-6" /> Save Product To Universe
              </>
            )}
         </button>
      </div>
    </form>
  );
}
