import { Feature, FeatureKey, FeatureStateMap } from './types'
import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'

interface FeatureStoreState {
  featuresState: Partial<FeatureStateMap>
  setFeatures: (featuresArray: Feature[]) => void
  setFeatureToggle: (key: FeatureKey, is_enabled: boolean) => void
  isEnabled: (key: FeatureKey) => boolean
}

export const useFeatureStore = createStoreDevToolsWrapper<FeatureStoreState>(
  (set, get) => ({
    featuresState: {},

    setFeatures: featuresArray => {
      const featuresMap = featuresArray.reduce((acc, feature) => {
        acc[feature.key] = feature.is_enabled
        return acc
      }, {} as FeatureStateMap)
      set({ featuresState: featuresMap }, false, 'feature/setFeatures')
    },

    setFeatureToggle: (key, is_enabled) =>
      set(
        (state: FeatureStoreState) => ({
          featuresState: {
            ...state.featuresState,
            [key]: is_enabled,
          },
        }),
        false,
        'feature/setFeatureToggle'
      ),

    isEnabled: key => {
      return !!get().featuresState[key]
    },
  }),
  'FeatureStore'
)
