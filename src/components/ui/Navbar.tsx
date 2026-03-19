"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { SlideOver } from "./SlideOver";
import { Modal } from "./Modal";

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full glass">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-black text-white italic font-black text-lg group-hover:rotate-12 transition-transform">
            H
          </div>
          <span className="hidden md:block font-extrabold text-xl tracking-tighter uppercase italic">Hotel Shop</span>
        </div>

        {/* Search - Show on larger mobiles and tablets */}
        <div className="flex-1 max-w-xl hidden md:flex relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <input
            type="text"
            placeholder="Search equipment, clothes, and more..."
            className="w-full bg-muted border-none rounded-2xl h-12 pl-12 pr-4 focus:ring-2 focus:ring-black outline-none transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-4">
          <nav className="hidden lg:flex items-center gap-6 mr-4">
            <div className="flex items-center gap-1 font-semibold cursor-pointer hover:text-muted-foreground transition-colors group">
              Categories
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
            <span className="font-semibold cursor-pointer hover:text-muted-foreground transition-colors">Offers</span>
          </nav>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 md:p-3 hover:bg-muted rounded-2xl transition-all relative group"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-black rounded-full border-2 border-white" />
          </button>

          <button 
            onClick={() => setIsLoginOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-4 md:px-6 h-10 md:h-12 rounded-xl md:rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-sm md:text-base"
          >
            <User className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden md:inline">Login</span>
          </button>

          <button className="lg:hidden p-2 md:p-3 hover:bg-muted rounded-2xl transition-all">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Cart SlideOver */}
      <SlideOver 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        title="Your Cart"
      >
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
          <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-muted text-muted-foreground mb-4">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold">Your cart is empty</h3>
          <p className="text-muted-foreground">Add products to see them here.</p>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="mt-6 bg-black text-white px-8 py-4 rounded-2xl font-bold"
          >
            Continue Shopping
          </button>
        </div>
      </SlideOver>

      {/* Login Modal */}
      <Modal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        title="Welcome Back"
      >
        <div className="space-y-6">
          <p className="text-muted-foreground text-center">Login to your account to manage orders and rewards.</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                placeholder="hello@example.com" 
                className="w-full bg-muted border-none rounded-2xl h-14 px-6 outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-muted border-none rounded-2xl h-14 px-6 outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>
          </div>
          <button 
            type="button" 
            className="w-full bg-black text-white h-14 rounded-2xl font-bold hover:scale-[1.01] transition-all"
          >
            Sign In
          </button>
          <p className="text-sm text-center text-muted-foreground">
            Don't have an account? <span className="text-black font-bold cursor-pointer">Register now</span>
          </p>
        </div>
      </Modal>
    </nav>
  );
}
