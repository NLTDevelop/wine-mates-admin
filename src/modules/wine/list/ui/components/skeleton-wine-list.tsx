import { File } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ContentLayout } from '@/layout/components/content-layout'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useTranslation } from 'react-i18next'

export const SkeletonWineList = () => {
  const { t } = useTranslation('wines')
  return (
    <ContentLayout title={t('list.wines_list')}>
      <div className="text-end mb-6">
        <Button className="sm:w-auto w-full" disabled>
          <File className="w-4 h-4 mr-2" />
          <Skeleton className="h-4 w-45" />
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <Skeleton className="h-10" />
      </div>

      <div className="rounded-lg">
        <div className="p-4">
          <div className="grid grid-cols-12 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div className="grid grid-cols-12 gap-4">
                {Array.from({ length: 12 }).map((_, colIndex) => (
                  <Skeleton key={colIndex} className={cn('h-4', colIndex === 0 && 'w-1/2')} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-8" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}
