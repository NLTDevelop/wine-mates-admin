import { WineTemplate } from './types'
import { Palette, Grape, Flower, Wine } from 'lucide-react'
import { TFunction } from 'i18next'

export const getWineTemplates = (t: TFunction): WineTemplate[] => {
  return [
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
    // {
    //   type: 'food_categories',
    //   name: t('food_categories'),
    //   description: t('settings_food_categories'),
    //   icon: <Flower size={20} />,
    // },
    {
      type: 'wine_creation',
      name: t('wine_creation'),
      description: t('add_wine'),
      icon: <Wine size={20} />,
    },
  ]
}
