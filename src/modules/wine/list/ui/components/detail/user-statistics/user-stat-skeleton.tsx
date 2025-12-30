import { Separator } from '@/UIKit/shadcn/ui/separator'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'

export const UserStatSkeleton = () => {
  
  return (
    <div className="space-y-4 pr-4 mb-6">
      <Skeleton className="h-4 w-1/4" />
      
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 bg-gray-700" />
            <Skeleton className="h-4 w-48 bg-gray-700" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="text-center p-1 bg-white/10 rounded-lg">
              <Skeleton className="h-8 w-12 mx-auto mb-1 bg-gray-700" />
              <Skeleton className="h-4 w-16 mx-auto bg-gray-700" />
            </div>
          ))}
        </div>
      </div>

      {[1, 2, 3, 4].map((section) => (
        <div key={section}>
          <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
          {section < 4 && <Separator />}
        </div>
      ))}
    </div>
  )
}