import { WineTemplate } from './types'
import { Palette, Grape, Flower, Wine, Tags } from 'lucide-react'
import { TFunction } from 'i18next'

export const getWineTemplates = (t: TFunction): WineTemplate[] => {
  return [
    {
      type: 'wine_type',
      name: t('wine_type'),
      description: t('settings_wine_type'),
      icon: <Tags size={20} />,
    },
    {
      type: 'color_palette',
      name: t('color_palette'),
      description: t('settings_color_palette'),
      icon: <Palette size={20} />,
    },
    {
      type: 'flavor_palette',
      name: t('flavor_palette'),
      description: t('settings_flavor_palette'),
      icon: <Grape size={20} />,
    },
    {
      type: 'smell_palette',
      name: t('smell_palette'),
      description: t('settings_smell_palette'),
      icon: <Flower size={20} />,
    },

    {
      type: 'wine_creation',
      name: t('wine_creation'),
      description: t('add_wine'),
      icon: <Wine size={20} />,
    },
  ]
}
