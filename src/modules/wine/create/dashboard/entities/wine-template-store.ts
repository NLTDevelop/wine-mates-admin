import { createStoreDevToolsWrapper } from '@/stores/creare-store-devtools-wrapper'
import { WineTemplate } from './types'


interface WineTemplateStoreState {
  wineTemplates: WineTemplate[]
  selectedTemplateType: string | null

  setWineTemplates: (templates: WineTemplate[]) => void
  setSelectedTemplateType: (templateType: string | null) => void
  reorderTemplates: (templates: WineTemplate[]) => void
  
  getTemplateByType: (type: string) => WineTemplate | undefined
  getSortedTemplates: () => WineTemplate[]
}

export const useWineTemplateStore = createStoreDevToolsWrapper<WineTemplateStoreState>(
  (set, get) => ({
    wineTemplates: [],
    selectedTemplateType: null,

    setWineTemplates: templates => 
      set({ wineTemplates: templates }, false, 'wineTemplates/setWineTemplates'),

    setSelectedTemplateType: templateType => 
      set({ selectedTemplateType: templateType }, false, 'wineTemplates/setSelectedTemplateType'),

    reorderTemplates: templates =>
      set({ wineTemplates: templates }, false, 'wineTemplates/reorderTemplates'),

    getTemplateByType: type => {
      return get().wineTemplates.find((t:WineTemplate) => t.type === type)
    },

    getSortedTemplates: () => {
      return [...get().wineTemplates].sort((a, b) => a.order - b.order)
    },
  }),
  'WineTemplateStore'
)