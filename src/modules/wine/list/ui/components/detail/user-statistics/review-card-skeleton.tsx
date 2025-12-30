import { Card } from '@/UIKit/shadcn/ui/card'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'

export const ReviewCardSkeleton = () => {
  return (
    <>
      <div className="flex items-center gap-2 pt-4 mb-4">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-32" />
      </div>
      {[1, 2, 3, 4].map(() => (
        <Card className="animate-pulse">
          <div className="h-full p-4 space-y-4">
            <div className="flex items-start gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="pt-2">
              <Skeleton className="h-3 w-24 ml-auto" />
            </div>
          </div>
        </Card>
      ))}
    </>
  )
}
