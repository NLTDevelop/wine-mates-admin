import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'
import { Group } from '../../enteties/items-types'
import { ItemResult } from './item-result'

interface ResultViewProps {
  wineType: string
  color: string
  groups: Group[]
  itemName: string
}

export const CharacteristicResult: React.FC<ResultViewProps> = ({ wineType, color, groups = [], itemName }) => {
  const { t } = useTranslation('wine_profile')

  const hasData = wineType || color || groups.length > 0

  return !hasData ? (
    <div className="text-center py-8 text-gray-400">{t('make_choosing')}</div>
  ) : (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 p-3 text-foreground font-bold text-xl">
        {wineType && <span>{wineType}</span>}
        {wineType && color && <span>- {color}</span>}
      </div>
      <Card className="bg-white">
        <CardContent className="md:p-0 sm:p-0">
          <CardHeader className="px-0 py-1 border-none mb-3">
            <h3 className="text-xl font-bold flex items-center gap-2">{itemName}</h3>
          </CardHeader>
          <ItemResult groups={groups} />
        </CardContent>
      </Card>
    </div>
  )
}
