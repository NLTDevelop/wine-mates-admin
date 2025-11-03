export interface WineTemplate {
  type: 'color_palette' | 'flavor_palette' | 'taste_palette' | 'wine_type' | 'wine_creation' | 'taste_characteristics_palette'
  name: string
  description: string
  icon?: React.ReactElement | string
  order?: number
}
