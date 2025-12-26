import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { IAroma, IBaseInfo } from '../../../entities/types'
import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { cn } from '@/lib/utils'

interface AromaAnalysisProps {
  aroma: IAroma
}

export const AromaAnalysis = ({ aroma }: AromaAnalysisProps) => {
  const { t } = useTranslation('wines')

  const renderContent = (char: IBaseInfo | string, label: string) => {
    const { textColorClass } = useContrastText(typeof char !== 'string' ? char.colorHex : '#f3efe7')
    return (
      <div
        className={cn('flex items-start gap-1 p-2 rounded-md', textColorClass, typeof char === 'string' ? 'flex-col' : 'flex-row')}
        style={{ backgroundColor: typeof char !== 'string' ? char.colorHex : '#f3efe7' }}
      >
        <label className={cn('flex-1', typeof char === 'string' && 'underline text-sm text-gray-500')}>{t(`flavors.${label}`)}:</label>
        {typeof char !== 'string' ? <p>{char.name} </p> : <p>{char} </p>}
      </div>
    )
  }

  return (
    <Card className="flex flex-col bg-input">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-0 px-0">
        <CardTitle className="flex gap-2 items-center text-sm font-medium">{t('aroma')} </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 !pb-0 !px-0">
        {Object.keys(aroma).length ? (
          <div className="space-y-2">
            {renderContent({ ...aroma.aromaGroup }, 'flavor_group')}
            {aroma.aromaSubGroup && renderContent({ ...aroma.aromaSubGroup }, 'flavor_shade')}
            {aroma.aromas && renderContent(aroma.aromas.map(a => a.name).join(', '), aroma.aromas.length !== 1 ? 'flavors' : 'flavor')}
            {aroma.note && renderContent(aroma.note, 'note')}
          </div>
        ) : (
          <p>{t('no_data')}</p>
        )}
      </CardContent>
    </Card>
  )
}
