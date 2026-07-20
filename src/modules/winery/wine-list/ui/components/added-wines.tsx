import { useContrastText } from '@/hooks/ui/useContrastText'
import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { X } from 'lucide-react'
import { useAddWinesStore } from '../../entities/wine-list-store'
import { useTranslation } from 'react-i18next'
import { useAddWineToWinery } from '../../presenters/useAddWineToWinery'


export const AddedWines = () => {
  const { t } = useTranslation('winery')
  const { selectedWines, setSelectedWines } = useAddWinesStore()
  const { addWines, isAdding } = useAddWineToWinery()

  const handleRemoveWine = (wineId: string) => {
    const updatedWines = selectedWines?.filter(w => w.id !== wineId) || []
    setSelectedWines(updatedWines)
  }

  const hasItems = Boolean(selectedWines?.length)

  const handleAddWines = async () => {
    await addWines()
  }

  return (
    <div
      className={cn('grid transition-[grid-template-rows,padding,margin] duration-300 ease-out', hasItems ? 'grid-rows-[1fr] mb-4 opacity-100' : 'grid-rows-[0fr] mb-0 opacity-0 pointer-events-none')}
    >
      <div className="overflow-hidden">
        <div className="flex items-start justify-between gap-4 py-1">
          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
            {selectedWines?.map(w => (
              <AddedWineItem key={w.id} wine={w} onRemove={handleRemoveWine} />
            ))}
          </div>

          <Button 
                onClick={handleAddWines}
                disabled={isAdding || !selectedWines?.length}
              >
                {isAdding ? t('button.adding') : t('button.add_wines')}
              </Button>
        </div>
      </div>
    </div>
  )
}

interface AddedWineItemProps {
  wine: any
  onRemove: (id: string) => void
}

export const AddedWineItem = ({ wine, onRemove }: AddedWineItemProps) => {
  const { textColorClass } = useContrastText(`${wine.color?.colorHex}`)

  if (!wine.id) return null

  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-border/50 bg-muted/40 p-3 pr-8 text-sm transition-all hover:bg-muted/70 animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-1">
        <p className="font-semibold leading-tight text-foreground">{wine.name}</p>
        <p className="text-xs text-muted-foreground">{wine.producer}</p>
      </div>

      {wine.color?.name && (
        <div className="mt-1.5">
          <span
            className={cn(textColorClass, 'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium shadow-xs ring-1 ring-border/40 ring-inset')}
            style={{
              backgroundColor: wine.color.colorHex || 'var(--background)',
            }}
          >
            {wine.color.name}
          </span>
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full text-muted-foreground opacity-70 transition-all hover:bg-destructive/10 hover:text-destructive hover:opacity-100"
        onClick={() => onRemove(wine.id)}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
