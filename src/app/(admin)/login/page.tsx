'use client';

import { useState } from 'react';
import { login } from './actions';
import { motion } from 'framer-motion';
import { ShoppingBag, Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-black/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-3xl bg-black text-white shadow-2xl mb-4">
             <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-black">
            Admin <br /><span className="text-muted-foreground">Universe</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground italic">
            Cozy Corner Control Center
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-black transition-colors" />
              <input
                name="email"
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-black transition-colors" />
              <input
                name="password"
                type="password"
                placeholder="PASSWORD"
                required
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-muted border-2 border-transparent focus:border-black focus:bg-white outline-none font-black text-sm uppercase italic transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-pastel-pink/20 border-2 border-pastel-pink/30 text-xs font-black uppercase italic text-black text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            disabled={isLoading}
            className="w-full h-16 bg-black text-white rounded-2xl flex items-center justify-center gap-3 font-black text-lg italic uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In to Dashboard'}
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-50">
          SECURE ACCESS ONLY &bull; 2026 COZY CORNER
        </p>
      </motion.div>
    </div>
  );
}
