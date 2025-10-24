import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContentLayout } from '@/layout/components/content-layout'
import { ColorPaletteManager } from '..'
import { FlavorPaletteManager } from '..'
import { WineTemplateSelector } from '..'
import { CreateWineForm } from '..'
import { SmellPaletteManager } from '..'
import { FoodCategoriesManager } from '..'

export const WineManagementView = () => {
  const { t } = useTranslation('wines')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const renderContent = () => {
    switch (selectedTemplate) {
      case 'color_palette':
        return <ColorPaletteManager />
      case 'flavor_palette':
        return <FlavorPaletteManager />
      case 'smell_palette':
        return <SmellPaletteManager />
      case 'food_categories':
        return <FoodCategoriesManager />
      case 'wine_creation':
        return <CreateWineForm />
      default:
        return <WineTemplateSelector selectedTemplate={selectedTemplate} onTemplateSelect={setSelectedTemplate} />
    }
  }
  const renderTitle = () => {
    switch (selectedTemplate) {
      case 'color_palette':
        return t('color_palette')
      case 'flavor_palette':
        return t('flavor_palette')
      case 'smell_palette':
        return t('smell_palette')
      case 'wine_creation':
        return t('create_wine')
      default:
        return t('create_wine')
    }
  }

  return (
    <ContentLayout title={renderTitle()} isGoBack={!!selectedTemplate} handleGoBack={() => setSelectedTemplate('')}>
      <div className="max-w-6xl mx-auto">{renderContent()}</div>
    </ContentLayout>
  )
}
