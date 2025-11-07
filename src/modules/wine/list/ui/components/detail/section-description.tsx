import React from 'react'
import { IWines } from '../../../entities/types/types'
import { useTranslation } from 'react-i18next'

export const DescriptionSection: React.FC<{ wine: IWines }> = ({ wine }) => {
  const { t } = useTranslation('wines')

  if (!wine.description) return null

  return (
    <section>
      <h3 className="text-lg font-semibold text-foreground mb-2">{t('description')}</h3>
      <p className="text-gray-500 leading-relaxed">{wine.description}</p>
    </section>
  )
}
