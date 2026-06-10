import { Country } from '@/modules/wine/create-wine/entities/types/location-types'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Card, CardContent } from '@/UIKit/shadcn/ui/card'
import { Trash2, Trash, Loader2 } from 'lucide-react'
import { SortableList } from '@/UIKit/app-components/sortable-list'
import { SortableItem } from '@/UIKit/app-components/sortable-item'
import { useTranslation } from 'react-i18next'

interface ResultSectionProps {
  savedCuisines: Country[]
  isLoading?: boolean
  isReordering?: boolean
  handleRemove: (id: number) => void
  handleClearAll: () => void
  handleReorder: (reorderedCuisines: Country[]) => void
}

export const ResultSection = ({ savedCuisines, isLoading = false, isReordering = false, handleRemove, handleClearAll, handleReorder }: ResultSectionProps) => {
  const { t } = useTranslation('cuisine')
  const { t: tc } = useTranslation('common')

  return (
    <Card className="border border-dashed p-0 w-1/2">
      <CardContent className="md:p-0 sm:p-0 h-[calc(100vh-200px)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pb-5 shrink-0">
          <h3 className="text-lg font-medium">{t('choosing_cuisines', { count: savedCuisines.length })}</h3>
          {savedCuisines.length > 0 && (
            <Button size="sm" onClick={handleClearAll} disabled={isReordering}>
              <Trash className="w-4 h-4" />
              {tc('button.deselect_all')}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 p-4 pt-2 min-h-0 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : isReordering ? (
            <div className="flex items-center justify-center h-full min-h-50">
              <p className="text-muted-foreground">{tc('button.saving')}</p>
            </div>
          ) : savedCuisines.length > 0 ? (
            <SortableList items={savedCuisines} onReorder={handleReorder} strategy="vertical" getId={cuisine => String(cuisine.id)}>
              {savedCuisines.map(cuisine => (
                <SortableItem key={cuisine.id} id={String(cuisine.id)} className="block w-full mb-3 last:mb-0" handleClassName="left-1 top-1/2 -translate-y-1/2" gridColor="text-muted-foreground/60">
                  <div className="flex items-center justify-between p-2 bg-background border border-border rounded-xl shadow-xs w-full">
                    <div className="flex items-center gap-3 ml-7">
                      <div className="w-7 h-7 rounded-full bg-accent/70 flex items-center text-sm justify-center shadow-xs">{cuisine.code}</div>
                      <span className="text-sm font-semibold text-foreground">{cuisine.name}</span>
                    </div>

                    <Button variant="ghost" onClick={() => handleRemove(cuisine.id)} className="text-muted-foreground/60 hover:text-error p-2 rounded-lg hover:bg-error/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </SortableList>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center pb-12 min-h-50">
              <p className="text-sm text-muted-foreground font-medium">{t('empty_list')}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{t('info')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
