import { useWineTemplateStore } from '../entities/wine-template-store'
import { useEffect } from 'react'
import { getWineTemplates } from './wine-templates'
import { useTranslation } from 'react-i18next'

export const useWineTemplates = () => {
  const store = useWineTemplateStore()
  const { t } = useTranslation('wines')

  const wineTemplates = useWineTemplateStore(state => state.wineTemplates)
  const setWineTemplates = useWineTemplateStore(state => state.setWineTemplates)

  useEffect(() => {
    if (wineTemplates.length === 0) {
      const staticTemplates = getWineTemplates(t)
      setWineTemplates(staticTemplates)
    }
  }, [t, wineTemplates.length, setWineTemplates])

  return {
    templates: wineTemplates,
    selectedTemplateType: store.selectedTemplateType,

    setSelectedTemplateType: store.setSelectedTemplateType,

    getTemplateByType: store.getTemplateByType,
  }
}
