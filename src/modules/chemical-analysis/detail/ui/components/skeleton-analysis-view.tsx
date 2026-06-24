import { ContentLayout } from '@/layout/components/content-layout'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Skeleton } from '@/UIKit/shadcn/ui/skeleton'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export const SkeletonAnalysisView = () => {
  const { t } = useTranslation('analysis')
  const navigate = useNavigate()

  return (
    <ContentLayout title={t('analysis_detail')} handleGoBack={() => navigate(-1)} isGoBack>
      <div className="mx-auto sm:px-4 px-1 sm:py-6 py-1 max-w-6xl">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-32" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            </div>

            <CardContent className="space-y-8 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-9 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-5 w-32" />
                      <div className="space-y-2">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="flex justify-between items-center">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-9 w-32" />
                  <Skeleton className="h-9 w-40" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-64 w-full rounded-lg" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  )
}
