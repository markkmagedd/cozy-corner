import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        
        {/* Images Section Placeholder */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-xl" />
            ))}
            <Skeleton className="aspect-square w-full rounded-xl border-2 border-dashed border-slate-200" />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="flex justify-end pt-4">
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
