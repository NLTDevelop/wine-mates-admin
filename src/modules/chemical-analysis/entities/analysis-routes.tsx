import { PATHS } from '@/navigation/paths'
import { AnalysisDetailView } from '../detail/ui'
import { AnalysisView } from '../list/ui'

export const winesAnalysis = [
  { path: PATHS.ANALYSIS, element: <AnalysisView /> },
  { path: PATHS.ANALYSIS_DETAIL, element: <AnalysisDetailView /> },
]
