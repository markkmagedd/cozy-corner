'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { logout } from '../login/actions';
import { useState } from 'react';

import { Toaster } from 'sonner';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/dashboard/products', icon: ShoppingBag },
  { name: 'Categories', href: '/admin/dashboard/categories', icon: Layers },
  { name: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r-2 border-muted h-screen sticky top-0 transition-all duration-500 flex flex-col z-50",
        isSidebarOpen ? "w-80" : "w-24"
      )}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="p-3 rounded-2xl bg-black text-white shadow-xl shadow-black/10 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black italic uppercase tracking-tighter text-black">
                Cozy<span className="text-muted-foreground opacity-50">Corner</span>
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-4 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 py-4 px-5 rounded-[1.5rem] font-black text-sm uppercase italic transition-all group relative overflow-hidden",
                  isActive 
                    ? "bg-black text-white shadow-2xl shadow-black/10 translate-x-1" 
                    : "text-muted-foreground hover:text-black hover:bg-muted"
                )}
              >
                <item.icon className={cn("w-6 h-6 shrink-0 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-30 transition-all", isActive && "opacity-50")} />
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-muted space-y-4">
          {isSidebarOpen && (
            <div className="p-5 rounded-3xl bg-muted/40 border-2 border-muted/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border-2 border-muted/60 flex items-center justify-center text-black shadow-sm">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest leading-none mb-1">Administrator</p>
                <p className="text-sm font-black italic text-black truncate uppercase tracking-tighter leading-none">Admin Shop</p>
              </div>
            </div>
          )}

          <button 
            onClick={() => logout()}
            className={cn(
              "w-full flex items-center gap-4 py-4 px-5 rounded-[1.5rem] font-black text-sm uppercase italic text-pastel-pink hover:bg-pastel-pink/10 transition-all",
              !isSidebarOpen && "justify-center px-0 py-5"
            )}
          >
            <LogOut className="w-6 h-6 shrink-0" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white flex flex-col min-w-0">
        <header className="h-24 bg-white/80 border-b-2 border-muted backdrop-blur-md flex items-center px-12 sticky top-0 z-40 transition-all">
           <div className="flex-1">
              <h2 className="text-xl font-black italic uppercase tracking-tighter text-black leading-none">
                 {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
              </h2>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-2">
                 <span className="px-5 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest italic rounded-full shadow-lg shadow-black/10">
                    Active Catalog
                 </span>
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto selection:bg-black/10">
          <AnimatePresence mode="wait">
             <motion.div 
               key={pathname}
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               transition={{ duration: 0.3 }}
               className="p-12 min-h-full"
             >
                {children}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
