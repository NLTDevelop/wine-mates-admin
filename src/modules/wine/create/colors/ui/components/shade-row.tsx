import { cn } from '@/lib/utils'
import { PaletteItemActions } from '../../../general/ui'
import { WineShades } from '../../entities/types/color-types'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { useTranslation } from 'react-i18next'

export const ShadeRow: React.FC<{
  item: WineShades
  isLoading: boolean
  onRemove: (id: string) => void
  onEdit: (item: WineShades) => void
  getItemName: (item: WineShades) => string
  cardTextColorClass: string
  isEditable: boolean
  showEditButton: boolean
}> = ({ item, isLoading, onRemove, onEdit, getItemName, cardTextColorClass, isEditable, showEditButton }) => {
  const { t } = useTranslation('wines')
  return (
    <div className="flex gap-2 justify-between sm:items-start items-center pl-8">
      <div className="flex gap-2 sm:flex-row flex-col sm:items-center items-start w-full">
        <div className="flex gap-2 items-center w-1/5">
          <div className="h-5 w-5 rounded-full flex-shrink-0 border border-gray-300" style={{ backgroundColor: item.colorHex }} />
          <div className="text-sm font-medium">{getItemName(item)}</div>
        </div>

        {(['tonePale', 'toneMedium', 'toneDeep'] as const).map(tone => {
          const toneColor = item?.[tone]
          const { textColorClass } = useContrastText(`${toneColor}`)
          return (
            <div key={tone} className="flex-1 text-center">
              <div className="w-full h-6 flex items-center justify-center rounded-sm px-1 py-0.5" style={{ backgroundColor: `${toneColor}` }}>
                <span className={cn('text-[12px] font-mono font-bold pr-0.5', textColorClass)}>{t(tone)}</span>
                <span className={cn('text-[12px] font-mono font-bold', textColorClass)}>{toneColor}</span>
              </div>
            </div>
          )
        })}
      </div>

      <PaletteItemActions
        isLoading={isLoading}
        onRemove={onRemove}
        dataId={item.id}
        cardTextColorClass={cardTextColorClass}
        onEdit={isEditable ? () => onEdit(item) : undefined}
        showEditButton={showEditButton}
        variant="row"
      />
    </div>
  )
}
