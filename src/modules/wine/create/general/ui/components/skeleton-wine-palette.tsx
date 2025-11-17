import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonWineTypeManagerProps {
  itemsCount?: number
}

export const SkeletonWinePalette = ({ itemsCount = 5 }: SkeletonWineTypeManagerProps) => {
  return (
    <Card>
      <CardContent className="space-y-2 sm:space-y-6 max-sm:p-0 sm:p-0">
        {/* <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-30" />
            <Skeleton className="h-10 w-48" />
          </div>
          
        </div> */}

        <div className="mx-auto flex flex-col justify-center gap-2 w-full">
          {Array.from({ length: itemsCount }).map((_, index) => (
            <div key={index} className={cn('border-1 border-input rounded-md transition-all cursor-default p-2')}>
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, colorIndex) => (
                      <Skeleton key={colorIndex} className="h-4 w-12 rounded text-xs" />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end items-center gap-2 pt-4">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
      </CardContent>
    </Card>
  )
}
