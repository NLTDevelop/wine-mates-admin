import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@/layout/components/content-layout'
import { WineTemplateSelector } from '..'
import { TastePaletteManager } from '../../../tastes/ui'
import { ColorPaletteManager } from '../../../colors/ui'
import { FlavorPaletteManager } from '../../../flavors/ui'
import { TasteCharacteristicsPaletteManager } from '../../../taste-characteristics/ui'
import { WineTypeManager } from '../../../wine-types/ui'
import { CreateWineForm } from '../../../wine/ui'

export const WineManagementView = () => {
  const { t } = useTranslation('wines')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const renderContent = () => {
    switch (selectedTemplate) {
      case 'wine_type':
        return <WineTypeManager />
      case 'color_palette':
        return <ColorPaletteManager />
      case 'flavor_palette':
        return <FlavorPaletteManager />
      case 'taste_palette':
        return <TastePaletteManager />
      case 'taste_characteristics_palette':
        return <TasteCharacteristicsPaletteManager />
      case 'wine_creation':
        return <CreateWineForm wineTypes={[]} />
      default:
        return <WineTemplateSelector selectedTemplate={selectedTemplate} onTemplateSelect={setSelectedTemplate} />
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
