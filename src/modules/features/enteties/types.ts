export type FeatureKey = 'tasting_notes' | 'wine_clubs' | 'user_management' | 'sommelier_chat' | 'shop_integration' //ключи функционала

export interface Feature {
  id: number
  key: FeatureKey
  name: string
  isEnabled: boolean
  updated_at: string
}

export interface FeatureUpdateData {
  key: FeatureKey
  isEnabled: boolean
}

export type FeatureStateMap = Record<FeatureKey, boolean>

export interface UpdateFeatureParams {
  key: FeatureKey
  isEnabled: boolean
}
