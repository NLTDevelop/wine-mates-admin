import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { Button } from '@/UIKit/shadcn/ui/button'
import { cn } from '@/lib/utils'
import { PaletteItemActions } from '../../../colors/ui/components/palette-item-actions'
import { WineAromaGroup } from '../../entities/types/flavor'

interface FlavorGroupCardProps {
  data: WineAromaGroup
  onRemove: (id: string) => void
  isLoading?: boolean
  isEditable?: boolean
  onToggleForm?: () => void
  isFormOpen?: boolean
  onCancel: (id: string) => void
}

export const FlavorGroupCard = ({ data, onRemove, isLoading, isEditable = false, onToggleForm, isFormOpen = false, onCancel }: FlavorGroupCardProps) => {
  const { t } = useTranslation('wines')

  const color = data.value?.[0] === '#' ? data.value : '#ffffff'
  const { textColorClass: cardTextColorClass } = useContrastText(color)

  const handleAddAromaClick = () => {
    if (isFormOpen && onCancel) {
      onCancel(data.id)
    } else if (onToggleForm) {
      onToggleForm()
    }
  }

  return (
    
    <div
      style={{ backgroundColor: color }}
      className={cn(
        'relative flex flex-col h-auto min-h-8 w-full items-start justify-between p-3 transition-all flex-1',
        isFormOpen ? 'rounded-t-md rounded-b-0' : 'rounded-md',
        'cursor-default',
        cardTextColorClass,
        'group',
        data.items && data.items.length > 0 ? 'gap-2 items-start' : 'gap-4'
      )}
    >
      <div className="flex items-start gap-2 justify-between w-full">
        <div className="flex gap-2 items-end">
          <span className={cn('text-label flex items-center flex-1', cardTextColorClass)}>
            {data.label} ({data.value})
          </span>
        </div>
        <PaletteItemActions isLoading={isLoading || false} onRemove={onRemove} dataId={data.id} cardTextColorClass={cardTextColorClass} showEditButton={false} />
      </div>

      {data.items && data.items.length > 0 && (
        <div className="space-y-2 mt-3 hover:brightness-100 w-full">
          {data.items.map((item, index) => (
            <div key={item.id || index} className="flex gap-2 justify-between items-start sm:items-end flex-col sm:flex-row">
              <div className="flex gap-2 flex-1 justify-between items-center">
                <div className="text-sm">{item.name}</div>
              </div>
              <PaletteItemActions isLoading={isLoading || false} onRemove={onRemove} dataId={item.id} cardTextColorClass={cardTextColorClass} showEditButton={false} />
            </div>
          ))}
        </div>
      )}

      <div className="w-full flex justify-end mt-4">
        <Button size="sm" variant="ghost" className="border-1" onClick={handleAddAromaClick}>
          {isFormOpen ? t('button.cancel') : t('button.add_new_aroma')}
        </Button>
      </div>
    </div>
  )
}
