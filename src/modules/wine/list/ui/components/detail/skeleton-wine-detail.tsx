import { Card } from '@/UIKit/shadcn/ui/card'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'

export const SkeletonWineDetail = () => {
  return (
    <div className="mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center my-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-6 mb-8 pb-6 border-b border-dashed border-muted-foreground">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, cellIndex) => (
                  <Skeleton key={cellIndex} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
