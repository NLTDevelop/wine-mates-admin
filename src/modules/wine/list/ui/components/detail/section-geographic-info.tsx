import React from 'react'
import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getCountryName } from '@/lib/localized-countries'
import { DetailSection } from '../..'
import { IWines } from '../../../entities/types/types'

export const GeographicInfoSection: React.FC<{ wine: IWines }> = ({ wine }) => {
  const { t } = useTranslation('wines')

  const fields = [
    { label: t('table.country'), value: wine.country ? getCountryName(wine.country, 'uk') : undefined },
    { label: t('table.region'), value: wine.region },
    { label: t('table.subregion'), value: wine.subRegion },
    { label: t('table.site'), value: wine.site },
  ].filter(field => field.value)

  if (fields.length === 0) return null

  return <DetailSection title={t('geographic_info')} icon={<MapPin size={20} />} fields={fields} />
}
