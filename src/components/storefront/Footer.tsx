import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-slate-800">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
              Cozy Corner
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-sm">
              Premium clothing and equipment for the modern explorer. Built for durability, designed for comfort.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-slate-300">Shop</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/category/clothing" className="hover:text-accent transition-colors">Clothing</Link></li>
              <li><Link href="/category/outerwear" className="hover:text-accent transition-colors">Outerwear</Link></li>
              <li><Link href="/category/equipment" className="hover:text-accent transition-colors">Equipment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4 text-slate-300">Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Shipping Returns</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Cozy Corner. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
