export interface WineTemplate {
  id: string
  type: 'color_palette' | 'flavor_palette' | 'taste_palette' | 'wine_type' | 'wine_profile' | 'taste_characteristics_palette'
  name: string
  description: string
  icon?: React.ReactElement | string
  order?: number
}

export interface ReorderWineTemplatesParams {
  templates: Array<{
    id: string
    order: number
  }>
}
