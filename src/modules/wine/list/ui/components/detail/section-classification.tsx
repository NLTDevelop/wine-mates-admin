import React from 'react'
import { Tag } from 'lucide-react'
import { IWines } from '../../../entities/types/types'
import { useTranslation } from 'react-i18next'
import { DetailSection } from '../..'

export const ClassificationSection: React.FC<{ wine: IWines }> = ({ wine }) => {
  const { t } = useTranslation('wines')

  const fields = [
    { label: t('table.classification'), value: wine.classification },
    null,
    { label: t('table.designation'), value: wine.designation },
    { label: t('table.reference'), value: wine.reference },
  ]

  if (fields.length === 0) return null

  return <DetailSection title={t('classification_info')} icon={<Tag size={20} />} fields={fields} />
}
