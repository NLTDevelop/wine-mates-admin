import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'

import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'
import { cn } from '@/lib/utils'
import { IBaseInfo, ITaste } from '../../../entities/chemical_types'

interface TasteAnalysisProps {
  taste: ITaste
}

export const TasteAnalysis = ({ taste }: TasteAnalysisProps) => {
  const { t } = useTranslation('wines')

  const renderContent = (char: IBaseInfo | string, label: string) => {
    const { textColorClass } = useContrastText(typeof char !== 'string' ? char.colorHex : "'#f3efe7")
    return (
      <div
        className={cn('flex  gap-1 p-2 rounded-md', textColorClass, typeof char === 'string' ? 'flex-col items-start' : 'flex-row items-center')}
        style={{ backgroundColor: typeof char !== 'string' ? char.colorHex : "'#f3efe7" }}
      >
        <label className={cn('flex-1', typeof char === 'string' && 'underline text-sm text-gray-500')}>{t(`tastes.${label}`)}:</label>
        {typeof char !== 'string' ? <p className="">{char.name}</p> : <p className="">{char}</p>}
      </div>
    )
  }

  return (
    <Card className="flex flex-col bg-input">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-0 px-0">
        <CardTitle className="flex gap-2 items-center text-sm font-medium">{t('taste')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 !pb-0 !px-0">{Object.keys(taste).length ? renderContent({ ...taste.taste }, 'taste_note') : <p>{t('no_data')}</p>}</CardContent>
    </Card>
  )
}
