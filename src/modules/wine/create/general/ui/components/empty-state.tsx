import { Tags, Palette, Grape, Flower } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface EmptyStateProps {
  type: 'wine-types' | 'colors' | 'aromas' | 'taste' | 'taste-characteristics'
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, className }) => {
  const { t } = useTranslation('wines')
  const config = {
    'wine-types': {
      icon: Tags,
      title: t('empty', { slug: 'Типи вина' }),
      description: t('empty_description', { slug: 'тип вина' }),
    },
    colors: {
      icon: Palette,
      title: t('empty', { slug: 'Кольори' }),
      description: t('empty_description', { slug: 'колір' }),
    },
    aromas: {
      icon: Flower,
      title: t('empty', { slug: 'Аромати' }),
      description: t('empty_description', { slug: 'аромат' }),
    },
    taste: {
      icon: Grape,
      title: t('empty', { slug: 'Смакові ноти' }),
      description: t('empty_description', { slug: 'смакову ноту' }),
    },
    'taste-characteristics': {
      icon: Grape,
      title: t('empty', { slug: 'Смакові характеристики' }),
      description: t('empty_description', { slug: 'смакову характеристику' }),
    },
  }

  const { icon: Icon, title, description } = config[type]

  return (
    <div className={cn('flex flex-col items-center justify-center text-center p-12 rounded-2xl', className)}>
      <Icon className="w-10 h-10 mb-2" />

      <h3 className="text-section mb-3">{title}</h3>

      <p className="text-description mb-8 max-w-md">{description}</p>
    </div>
  )
}
