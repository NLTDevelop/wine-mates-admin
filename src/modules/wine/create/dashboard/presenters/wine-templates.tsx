import { WineTemplate } from '../entities/types'
import { Palette, Grape, Flower, Wine, Tags } from 'lucide-react'
import { TFunction } from 'i18next'

export const getWineTemplates = (t: TFunction): WineTemplate[] => {
  return [
    {
      id: 'wine_type_1',
      type: 'wine_type',
      name: t('wine_type'),
      description: t('settings_wine_type'),
      icon: <Tags size={20} />,
      order: 0,
    },
    {
      id: 'color_palette_1',
      type: 'color_palette',
      name: t('color_palette'),
      description: t('settings_color_palette'),
      icon: <Palette size={20} />,
      order: 1,
    },
    {
      id: 'flavor_palette_1',
      type: 'flavor_palette',
      name: t('flavor_palette'),
      description: t('settings_flavor_palette'),
      icon: <Flower size={20} />,
      order: 2,
    },
    {
      id: 'taste_palette_1',
      type: 'taste_palette',
      name: t('taste_palette'),
      description: t('settings_taste_palette'),
      icon: <Grape size={20} />,
      order: 3,
    },
    {
      id: 'taste_characteristics_1',
      type: 'taste_characteristics_palette',
      name: t('taste_characteristics_palette'),
      description: t('settings_taste_characteristics_palette'),
      icon: <Grape size={20} />,
      order: 4,
    },
    {
      id: 'wine_creation_1',
      type: 'wine_creation',
      name: t('wine_creation'),
      description: t('add_wine'),
      icon: <Wine size={20} />,
      order: 5,
    },
  ]
}
