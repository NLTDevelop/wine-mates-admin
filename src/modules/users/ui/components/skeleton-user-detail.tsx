import { Card } from '@/UIKit/shadcn/ui/card'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'

export const SkeletonUserDetail = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>
      <Card className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Card>
    </div>
  )
}
