import { Card, CardContent, CardHeader, CardTitle } from '@/UIKit/shadcn/ui/card'
import { useTranslation } from 'react-i18next'

interface ChemicalIndicatorCardProps {
  title: string
  value: number
  unit: string
  date?: string
  icon?: React.ReactNode
}

export const ChemicalIndicatorCard = ({ title, value, unit, icon }: ChemicalIndicatorCardProps) => {
  const { t } = useTranslation('analysis')

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-0 flex-1">
        <CardTitle className="flex gap-2 items-center text-sm font-medium">
          {title} {icon}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 !pb-0">{value ? <div className="text-2xl font-bold">{`${value} ${unit}`}</div> : <p>{t('no_data')}</p>}</CardContent>
    </Card>
  )
}
