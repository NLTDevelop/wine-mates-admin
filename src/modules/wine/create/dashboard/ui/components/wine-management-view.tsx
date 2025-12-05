import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@/layout/components/content-layout'
import { WineTemplateSelector } from '..'
import { TastePaletteManager } from '../../../tastes/ui'
import { FlavorPaletteManager } from '../../../flavors/ui'
import { ColorPaletteManager } from '../../../colors/ui'
import { WineTypeManager } from '../../../wine-types/ui/components/wine-type-manager'
import { useCachedColors } from '../../../general/presenters/useCachedColors'
import { TasteCharacteristicsPaletteManager } from '../../../taste-characteristics/ui'
import { CreateWineForm } from '../../../wine/ui'
import { useCachedWineTypes } from '../../../general/presenters/useCachedWineTypes'

export const WineManagementView = () => {
  const { t } = useTranslation('wines')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const { cachedColors, isLoading: colorsLoading, refreshColors } = useCachedColors()
  const { cachedWineTypes, isLoading: wineTypesLoading } = useCachedWineTypes()

  const handleTemplateSelect = async (template: string) => {
    if (template === 'wine_type') {
      await refreshColors()
    }
    setSelectedTemplate(template)
  }

  const renderContent = () => {
    switch (selectedTemplate) {
      case 'wine_type':
        return <WineTypeManager cachedColors={cachedColors} colorsLoading={colorsLoading} />
      case 'color_palette':
        return <ColorPaletteManager />
      case 'flavor_palette':
        return <FlavorPaletteManager cachedColors={cachedColors} colorsLoading={colorsLoading} />
      case 'taste_palette':
        return <TastePaletteManager cachedColors={cachedColors} colorsLoading={colorsLoading} />
      case 'taste_characteristics_palette':
        return <TasteCharacteristicsPaletteManager cachedColors={cachedColors} colorsLoading={colorsLoading} />
      case 'wine_creation':
        return <CreateWineForm wineTypes={cachedWineTypes} cachedColors={cachedColors} colorsLoading={colorsLoading} wineTypesLoading={wineTypesLoading} />
      default:
        return <WineTemplateSelector selectedTemplate={selectedTemplate} onTemplateSelect={handleTemplateSelect} />
    }
  }
  const renderTitle = () => {
    switch (selectedTemplate) {
      case 'wine_type':
        return t('wine_type')
      case 'color_palette':
        return t('color_palette')
      case 'flavor_palette':
        return t('flavor_palette')
      case 'taste_palette':
        return t('taste_palette')
      case 'taste_characteristics_palette':
        return t('taste_characteristics.characteristics')
      case 'wine_creation':
        return t('create_wine')
      default:
        return t('create_wine')
    }
  }

  return (
    <ContentLayout title={renderTitle()} isGoBack={!!selectedTemplate} handleGoBack={() => setSelectedTemplate('')}>
      <div>{renderContent()}</div>
    </ContentLayout>
  )
}
