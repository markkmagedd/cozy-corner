import { ShoppingBag, Layers, Activity, Users } from 'lucide-react';
import Link from 'next/link';

export default function DashboardOverview() {
  const stats = [
    { name: 'Products', value: '124', icon: ShoppingBag, color: 'bg-pastel-blue/20' },
    { name: 'Categories', value: '12', icon: Layers, color: 'bg-pastel-green/20' },
    { name: 'Site Views', value: '45.2K', icon: Activity, color: 'bg-pastel-pink/20' },
    { name: 'Admins', value: '1', icon: Users, color: 'bg-pastel-yellow/20' },
  ];

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-4 border-black pb-8 gap-6">
        <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-black">
          Dashboard <br /><span className="text-muted-foreground">Overview</span>
        </h1>
        <div className="flex gap-4">
          <Link 
            href="/admin/dashboard/products" 
            className="px-8 py-4 bg-black text-white rounded-2xl font-black italic uppercase tracking-tighter text-sm shadow-xl shadow-black/10 hover:scale-[1.05] transition-transform"
          >
            Manage Products
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="group p-8 rounded-[2.5rem] bg-muted border-2 border-transparent hover:border-black transition-all shadow-sm"
          >
            <div className={`p-4 rounded-2xl ${stat.color} text-black mb-6 w-fit shadow-inner`}>
              <stat.icon className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 mb-1 leading-none">Total {stat.name}</p>
            <p className="text-5xl font-black italic tracking-tighter text-black leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="p-12 rounded-[3.5rem] bg-linear-to-br from-muted/50 via-white to-muted/30 border-2 border-muted/50 flex flex-col md:flex-row items-center gap-12 shadow-inner">
         <div className="w-1/3 aspect-square rounded-[3rem] bg-black text-white flex items-center justify-center p-12">
            <ShoppingBag className="w-full h-full opacity-20" />
         </div>
         <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-black">
               Your Catalog <br />is Ready.
            </h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-lg">
               You can now start managing your product inventory and categories using the left sidebar. All changes are synchronized in real-time with the store's "Product Universe".
            </p>
         </div>
      </div>
    </div>
  );
}
