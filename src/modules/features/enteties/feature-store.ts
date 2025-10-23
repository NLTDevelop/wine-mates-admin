import { create } from 'zustand';
import { Feature, FeatureKey, FeatureStateMap } from './types';



interface FeatureStoreState {

  featuresState: Partial<FeatureStateMap>; 
  

  setFeatures: (featuresArray: Feature[]) => void;
  setFeatureToggle: (key: FeatureKey, is_enabled: boolean) => void;
  isEnabled: (key: FeatureKey) => boolean; 
}

export const useFeatureStore = create<FeatureStoreState>((set, get) => ({
  featuresState: {},

  setFeatures: (featuresArray) => {
    const featuresMap = featuresArray.reduce((acc, feature) => {
      acc[feature.key] = feature.is_enabled;
      return acc;
    }, {} as FeatureStateMap); 
    set({ featuresState: featuresMap });
  },

  setFeatureToggle: (key, is_enabled) =>
    set((state) => ({
      featuresState: {
        ...state.featuresState,
        [key]: is_enabled,
      },
    })),
    

  isEnabled: (key) => {
    return !!get().featuresState[key]; 
  },
}));