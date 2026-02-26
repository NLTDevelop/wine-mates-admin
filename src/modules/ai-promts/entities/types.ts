type AIProvider = 'openai' | 'gemini'
export type FeatureType = 'snacks' | 'tasting_note' | 'scanner'

interface Threshold {
  name: string
  value: number
  description: string
}

interface BaseConfig {
  id: number
  featureType: FeatureType
  aiProvider: AIProvider
  availableModels: string[]
}

export interface OpenAIFeatureConfig extends BaseConfig {
  aiProvider: 'openai'
  featureType: 'snacks' | 'tasting_note'
  config: {
    systemPrompt: string
    model: string
    temperature: number
    maxTokens: number
  }
}

export interface GeminiFeatureConfig extends BaseConfig {
  aiProvider: 'gemini'
  featureType: 'scanner'
  config: {
    systemPrompt: string
    model: string
    thresholds: Threshold[]
  }
}

export type FeatureConfig = OpenAIFeatureConfig | GeminiFeatureConfig

interface BaseUpdateConfig {
  id?: number
  featureType?: FeatureType
  aiProvider?: AIProvider
  availableModels?: string[]
}

export interface OpenAIUpdateConfig extends BaseUpdateConfig {
  aiProvider?: 'openai'
  featureType?: 'snacks' | 'tasting_note'
  config?: {
    systemPrompt?: string
    model?: string
    temperature?: number
    maxTokens?: number
  }
}

export interface GeminiUpdateConfig extends BaseUpdateConfig {
  aiProvider?: 'gemini'
  featureType?: 'scanner'
  config: {
    systemPrompt?: string
    model?: string
    thresholds: Threshold[]
  }
}

export type FeatureUpdateConfig = OpenAIUpdateConfig | GeminiUpdateConfig
