import { Skeleton } from '@/components/ui/Skeleton'

export default function LoadingCategories() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="bg-white border text-slate-800 border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex gap-2">
           <Skeleton className="h-10 flex-1 max-w-sm" />
           <Skeleton className="h-10 w-24" />
        </div>
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
