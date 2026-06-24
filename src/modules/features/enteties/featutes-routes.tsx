import { PATHS } from '@/navigation/paths'
import { FeaturesView } from '../ui'
import { AiPromtView } from '@/modules/ai-promts/ui'

export const featuresRoutes = [
  { path: PATHS.FEATURES, element: <FeaturesView /> },
  { path: PATHS.AI_PROMTS, element: <AiPromtView /> },
]
