import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="w-full md:w-64 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="aspect-square w-full rounded-xl" />
            </div>
          </div>
        </div>
        
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
