import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'

interface ChemicalIndicatorCardProps {
  title: string
  value: number
  unit: string
  date?: string
  icon?: React.ReactNode
}

const formatDate = (dateStr?: string): string => {
  const { t } = useTranslation('analysis')

  if (!dateStr) return t('no_data')

  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
  })
}

export const ChemicalIndicatorCard = ({ title, value, unit, date, icon }: ChemicalIndicatorCardProps) => {
  const { t } = useTranslation('analysis')

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0 flex-1">
        <CardTitle className="flex gap-2 items-center text-sm font-medium">
          {title} {icon}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 !pb-0">
        {value ? (
          <>
            <div className="text-2xl font-bold">{`${value} ${unit}`}</div>
            <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
          </>
        ) : (
          <p>{t('no_data')}</p>
        )}
      </CardContent>
    </Card>
  )
}
