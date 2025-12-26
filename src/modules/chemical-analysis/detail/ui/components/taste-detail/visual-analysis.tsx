import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { IBaseInfo, IVisual } from '../../../entities/types'
import { useTranslation } from 'react-i18next'
import { useContrastText } from '@/hooks/ui/useContrastText'

interface VisualAnalysisProps {
  visual: IVisual
}

export const VisualAnalysis = ({ visual }: VisualAnalysisProps) => {
  const { t } = useTranslation('wines')

  const renderContent = (char: IBaseInfo | number, label: string) => {
    const { textColorClass } = useContrastText(typeof char !== 'number' ? char.colorHex : "'#f3efe7")
    return (
      <div className={`flex items-start gap-1 p-2 rounded-md ${textColorClass}`} style={{ backgroundColor: typeof char !== 'number' ? char.colorHex : "'#f3efe7" }}>
        <label className="flex-1">{t(`colors.${label}`)}:</label>
        {typeof char !== 'number' ? <p className="">{char.name}</p> : <p className="">{char}</p>}
      </div>
    )
  }

  return (
    <Card className="flex flex-col bg-input">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-0 px-0">
        <CardTitle className="flex gap-2 items-center text-sm font-medium">{t('visual')}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 !px-0 !pb-0">
        {Object.keys(visual).length ? (
          <div className="space-y-2">
            {renderContent({ ...visual.color }, 'color')}
            {visual.shade && renderContent({ ...visual.shade }, 'shade')}
            {visual.tone && renderContent({ ...visual.tone }, 'tone')}
            {visual.perlage && renderContent(visual.perlage, 'perlage')}
            {visual.mousse && renderContent(visual.mousse, 'mousse')}
          </div>
        ) : (
          <p>{t('no_data')}</p>
        )}
      </CardContent>
    </Card>
  )
}
