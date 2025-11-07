import React from 'react'
import { Calendar } from 'lucide-react'
import { IWines } from '../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { DetailSection } from '../..'

export const VintageInfoSection: React.FC<{ wine: IWines }> = ({ wine }) => {
  const { t } = useTranslation('wines')

  const fields = [
    { label: t('table.vintageconfig'), value: wine.vintageConfig?.toString() },
    null,
    { label: t('table.firstvintage'), value: wine.firstVintage?.toString() },
    { label: t('table.finalvintage'), value: wine.finalVintage?.toString() },
  ]

  if (fields.length === 0) return null

  return <DetailSection title={t('vintage_info')} icon={<Calendar size={20} />} fields={fields} />
}
