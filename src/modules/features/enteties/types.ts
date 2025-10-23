export type FeatureKey = 'tasting_notes' | 'wine_clubs' | 'user_management' | "sommelier_chat" | "shop_integration";//ключи функционала

export interface Feature {
  id: number;
  key: FeatureKey;
  name: string;
  is_enabled: boolean;
  updated_at: string;
}


export interface FeatureUpdateData {
  key: FeatureKey;
  is_enabled: boolean;
}


export type FeatureStateMap = Record<FeatureKey, boolean>;

export interface UpdateFeatureParams {
  key: FeatureKey;
  is_enabled: boolean;
}