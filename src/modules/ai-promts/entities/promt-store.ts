import { create } from 'zustand'
import { FeatureType, GeminiFeatureConfig, OpenAIFeatureConfig } from './types'

interface PromtState {
  activeTab: FeatureType
  accordionState: {
    snacks: string
    tasting_note: string
    blind_tasting_note: string
    scanner: string
  }

  snacks?: OpenAIFeatureConfig
  tasting_note?: OpenAIFeatureConfig
  blind_tasting_note?: OpenAIFeatureConfig
  scanner?: GeminiFeatureConfig
  isLoading: boolean

  setActiveTab: (tab: FeatureType) => void
  setAccordionState: (tab: FeatureType, value: string) => void
  setSnacks: (snacks?: OpenAIFeatureConfig) => void
  setTasting: (tasting_note?: OpenAIFeatureConfig) => void
  setBlindTasting: (blind_tasting_note?: OpenAIFeatureConfig) => void
  setScanner: (scanner?: GeminiFeatureConfig) => void
  setIsLoading: (isLoading: boolean) => void
}

export const usePromtStore = create<PromtState>(set => ({
  activeTab: 'scanner',
  accordionState: { snacks: '', tasting_note: '', blind_tasting_note: '', scanner: '' },
  data: undefined,
  isLoading: false,

  setActiveTab: tab =>
    set(() => ({
      activeTab: tab,
    })),
  setAccordionState: (tab, value) =>
    set(state => ({
      accordionState: {
        ...state.accordionState,
        [tab]: value,
      },
    })),

  setSnacks: snacks => set({ snacks }),

  setTasting: tasting_note => set({ tasting_note }),
  setBlindTasting: blind_tasting_note => set({ blind_tasting_note }),
  setScanner: scanner => set({ scanner }),

  setIsLoading: isLoading => set({ isLoading }),
}))
