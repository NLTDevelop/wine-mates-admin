import React from 'react'
import { FileText } from 'lucide-react'
import { IWines } from '../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { DetailSection } from '../..'

export const BasicInfoSection: React.FC<{ wine: IWines }> = ({ wine }) => {
  const { t } = useTranslation('wines')

  const fields = [
    { label: t('table.producertitle'), value: wine.producerTitle },
    { label: t('table.wine'), value: wine.wine },
    { label: t('table.type'), value: wine.type?.nameUa },
    { label: t('table.subtype'), value: wine.subType },
  ].filter(field => field.value)

  if (fields.length === 0) return null

  return <DetailSection title={t('basic_info')} icon={<FileText size={20} />} fields={fields} />
}
