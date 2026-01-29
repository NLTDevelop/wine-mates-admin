import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Tags, Palette, Grape, Flower } from 'lucide-react'

interface EmptyStateProps {
  type: 'wine-types' | 'colors' | 'aromas' | 'taste' | 'taste-characteristics' | 'profile'
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, className }) => {
  const { t } = useTranslation('wines')
  const config = {
    'wine-types': {
      icon: Tags,
      title: t('empty', { slug: t('types.wine_types') }),
      description: t('empty_description', { slug: t('types.wine_type').toLowerCase() }),
    },
    colors: {
      icon: Palette,
      title: t('empty', { slug: t('colors.colors') }),
      description: t('empty_description', { slug: t('colors.color').toLowerCase() }),
    },
    aromas: {
      icon: Flower,
      title: t('empty', { slug: t('flavors.flavors') }),
      description: t('empty_description', { slug: t('flavors.flavor').toLowerCase() }),
    },
    taste: {
      icon: Grape,
      title: t('empty', { slug: t('tastes.taste_notes') }),
      description: t('empty_description', { slug: t('tastes.taste') }),
    },
    'taste-characteristics': {
      icon: Grape,
      title: t('empty', { slug: t('taste_characteristics.characteristics') }),
      description: t('empty_description', { slug: t('taste_characteristics.of_characteristic').toLowerCase() }),
    },
    profile: {
      icon: Grape,
      title: t('empty', { slug: t('wine_profiles.profile') }),
      description: t('empty_description', { slug: t('wine_profiles.of_profile').toLowerCase() }),
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
