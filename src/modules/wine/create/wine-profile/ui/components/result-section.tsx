import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Palette } from 'lucide-react'
import { CharacteristicItem, ItemResult } from '..'
import { IOption, IOptionWithColor } from '../../enteties/types/types'
import { Group, Subgroup, TasteLevelItem } from '../../enteties/types/items-types'
import { useProfileStore } from '../../enteties/profile-store'

interface ResultSectionProps {
  wineType: any
  wineColor: any
  resultAromasDataGroups: Group<Subgroup<IOption>>[]
  resultFlavorsDataGroups: Group<Subgroup<IOptionWithColor>>[]
  resultCharacteristicDataGroups: Group<Subgroup<TasteLevelItem>>[]
}

export const ResultSection = ({ wineType, wineColor, resultAromasDataGroups, resultFlavorsDataGroups, resultCharacteristicDataGroups }: ResultSectionProps) => {
  const { t } = useTranslation('wine_profile')

  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)
  const { selectedImage } = useProfileStore()

  const handleToggleAccordion = (id: string) => {
    setOpenAccordionId(prevId => (prevId === id ? null : id))
  }
  return (
    <Card className="border border-dashed p-0 w-1/2">
      <CardContent className="md:p-0 sm:p-0">
        <CardHeader className="px-0 py-1 border-none mb-3">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Palette className="w-5 h-5" />
            {t('result')}
          </h3>
        </CardHeader>
        <div className="flex">
          {!!selectedImage && (
            <div key={selectedImage.id} className="relative cursor-pointer group  w-20 py-4">
              <img src={selectedImage?.src} alt={selectedImage?.alt} className="w-full h-40 object-cover rounded-lg shadow-md" />
            </div>
          )}
          <div className="flex flex-1 items-start justify-center gap-2 p-3 text-foreground font-bold text-xl">
            {wineType && <span>{wineType}</span>}
            {wineType && wineColor && <span>- {wineColor}</span>}
          </div>
        </div>
        <div className="space-y-4">
          {resultAromasDataGroups.length > 0 && (
            <CharacteristicItem
              id="aroma_result"
              label={t('selected_aromas')}
              isOpen={openAccordionId === 'aroma_result'}
              onToggle={() => handleToggleAccordion('aroma_result')}
              header={<p>{t('aroma_result')}</p>}
            >
              <Card className="bg-white">
                <CardContent className="md:p-0 sm:p-0">
                  <ItemResult<IOption> groups={resultAromasDataGroups} />
                </CardContent>
              </Card>
            </CharacteristicItem>
          )}

          {resultFlavorsDataGroups.length > 0 && (
            <CharacteristicItem
              id="flavor_result"
              label={t('selected_flavors')}
              isOpen={openAccordionId === 'flavor_result'}
              onToggle={() => handleToggleAccordion('flavor_result')}
              header={<p>{t('flavor_result')}</p>}
            >
              <Card className="bg-white">
                <CardContent className="md:p-0 sm:p-0">
                  <ItemResult<IOptionWithColor> groups={resultFlavorsDataGroups} />
                </CardContent>
              </Card>
            </CharacteristicItem>
          )}

          {resultCharacteristicDataGroups.length > 0 && (
            <CharacteristicItem
              id="char_result"
              label={t('selected_taste_characteristics')}
              isOpen={openAccordionId === 'char_result'}
              onToggle={() => handleToggleAccordion('char_result')}
              header={<p>{t('char_result')}</p>}
            >
              <Card className="bg-white">
                <CardContent className="md:p-0 sm:p-0">
                  <ItemResult<TasteLevelItem> groups={resultCharacteristicDataGroups} />
                </CardContent>
              </Card>
            </CharacteristicItem>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
