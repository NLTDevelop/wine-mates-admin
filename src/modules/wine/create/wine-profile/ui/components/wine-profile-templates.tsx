import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Palette, Plus } from 'lucide-react'
import { Button } from '@/UIKit/shadcn/ui/button'
import { CharacteristicItem } from './characteristic-item'
import { useState } from 'react'
import { aromasMock, CharacteristicContent, charMock, flavorMock } from './characteristic-content'
import { ProfileSelects } from './profile-selects'
import { useWineProfile } from '../../presenters/useWineProfile'
import { useTranslation } from 'react-i18next'
import type { BaseWineColor } from '../../../general/entities/types'
import type { WineType } from '../../../wine-types/entities/types/wine-type'
import { useGroupManagement } from '../../presenters/useGroupManagement'
import { CharacteristicResult } from './characteristic-result'

interface WineProfileTemplatesProps {
  wineTypes: WineType[]
  cachedColors: BaseWineColor[]
  colorsLoading: boolean
  wineTypesLoading: boolean
}

export const WineProfileTemplates = ({ wineTypes, cachedColors }: WineProfileTemplatesProps) => {
  const { t } = useTranslation('wine_profile')
  const { t: tc } = useTranslation('common')

  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)

  const { selectedType, typeNames, setSelectedType, selectedColor, colorNames, setSelectedColor } = useWineProfile({ wineTypes, cachedColors })

  const aromas = useGroupManagement({ initialGroups: aromasMock, itemName: 'aromas' })
  const flavors = useGroupManagement({ initialGroups: flavorMock, itemName: 'flavors' })
  const characteristic = useGroupManagement({ initialGroups: charMock, itemName: 'characteristic' })

  const handleToggleAccordion = (id: string) => {
    setOpenAccordionId(prevId => (prevId === id ? null : id))
  }

  const getDisplayName = (id: string, items: any[]) => {
    if (!id) return ''
    const item = items.find(item => item.id?.toString() === id)
    return item?.translations?.[0]?.name || item?.name || id
  }

  const getColorHex = (colorId: string) => {
    const color = cachedColors.find(c => c.id?.toString() === colorId)
    return color?.colorHex || '#ccc'
  }

  const handleSaveProfile = async () => {
    if (!selectedType || !selectedColor) {
      return
    }
    const aromaData = aromas.getSelectedGroupData?.() || {
      aromaGroupIds: [],
      aromaSubgroupIds: [],
      aromaIds: [],
    }

    const profileData = {
      wineTypeId: selectedType,
      colorId: selectedColor,
      aromaGroupIds: aromaData.groupIds || [],
      aromaSupgroupIds: aromaData.subgroupIds || [],
      flavorGroupIds: [],
      flavorIds: [],
      characteristicGroupIds: [],
      characteristicIds: [],
    }

    try {
      // await api.createWineProfile(profileData)
      console.log('Профиль сохранен', profileData)
    } catch (error) {
      console.error('Ошибка сохранения:', error)
    }
  }

  const resultAromasData = {
    wineType: getDisplayName(selectedType, wineTypes),
    color: getDisplayName(selectedColor, cachedColors),
    colorHex: getColorHex(selectedColor),
    groups: aromas.getResultData ? aromas.getResultData() : [],
  }
  const resultFlavorsData = {
    wineType: getDisplayName(selectedType, wineTypes),
    color: getDisplayName(selectedColor, cachedColors),
    colorHex: getColorHex(selectedColor),
    groups: flavors.getResultData ? flavors.getResultData() : [],
  }
  const resultCharacteristicData = {
    wineType: getDisplayName(selectedType, wineTypes),
    color: getDisplayName(selectedColor, cachedColors),
    colorHex: getColorHex(selectedColor),
    groups: characteristic.getResultData ? characteristic.getResultData() : [],
  }

  const canSave = selectedType && selectedColor

  return (
    <div className="flex gap-3">
      <Card className="border-1 border-dashed p-0 w-1/2">
        <CardContent className="md:p-0 sm:p-0">
          <CardHeader className="px-0 py-1 border-none mb-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {t('create_new_profile')}
            </h3>
          </CardHeader>

          <div className="space-y-4">
            <ProfileSelects
              selectedType={selectedType}
              typeNames={typeNames}
              setSelectedType={setSelectedType}
              selectedColor={selectedColor}
              colorNames={colorNames}
              setSelectedColor={setSelectedColor}
            />

            <CharacteristicItem id="aromas" label={t('aromas')} isOpen={openAccordionId === 'aromas'} onToggle={() => handleToggleAccordion('aromas')} header={<p>{t('aromas')}</p>}>
              <CharacteristicContent
                groups={aromas.groups}
                deleteGroup={aromas.deleteGroup}
                deleteSubgroup={aromas.deleteSubgroup}
                toggleGroupInSubgroup={aromas.toggleItemsInSubgroup}
                restoreGroup={aromas.restoreGroup}
                restoreSubgroup={aromas.restoreSubgroup}
                getSubgroupOptions={aromas.getSubgroupOptions}
                deletedGroups={aromas.deletedGroups}
                setDeletedGroups={aromas.setDeletedGroups}
                deletedSubgroups={aromas.deletedSubgroups}
                setDeletedSubgroups={aromas.setDeletedSubgroups}
                isGroupDeleted={aromas.isGroupDeleted}
                isSubgroupDeleted={aromas.isSubgroupDeleted}
                isItems
              />
            </CharacteristicItem>

            <CharacteristicItem id="flavors" label={t('flavors')} isOpen={openAccordionId === 'flavors'} onToggle={() => handleToggleAccordion('flavors')} header={<p>{t('flavors')}</p>}>
              <CharacteristicContent
                groups={flavors.groups}
                deleteGroup={flavors.deleteGroup}
                deleteSubgroup={flavors.deleteSubgroup}
                toggleGroupInSubgroup={flavors.toggleItemsInSubgroup}
                restoreGroup={flavors.restoreGroup}
                restoreSubgroup={flavors.restoreSubgroup}
                getSubgroupOptions={flavors.getSubgroupOptions}
                deletedGroups={flavors.deletedGroups}
                setDeletedGroups={flavors.setDeletedGroups}
                deletedSubgroups={flavors.deletedSubgroups}
                setDeletedSubgroups={flavors.setDeletedSubgroups}
                isGroupDeleted={flavors.isGroupDeleted}
                isSubgroupDeleted={flavors.isSubgroupDeleted}
              />
            </CharacteristicItem>

            <CharacteristicItem
              id="characteristics"
              label={t('characteristics')}
              isOpen={openAccordionId === 'characteristics'}
              onToggle={() => handleToggleAccordion('characteristics')}
              header={<p>{t('characteristics')}</p>}
            >
              <CharacteristicContent
                groups={characteristic.groups}
                deleteGroup={characteristic.deleteGroup}
                deleteSubgroup={characteristic.deleteSubgroup}
                toggleGroupInSubgroup={characteristic.toggleItemsInSubgroup}
                restoreGroup={characteristic.restoreGroup}
                restoreSubgroup={characteristic.restoreSubgroup}
                getSubgroupOptions={characteristic.getSubgroupOptions}
                deletedGroups={characteristic.deletedGroups}
                setDeletedGroups={characteristic.setDeletedGroups}
                deletedSubgroups={characteristic.deletedSubgroups}
                setDeletedSubgroups={characteristic.setDeletedSubgroups}
                isGroupDeleted={characteristic.isGroupDeleted}
                isSubgroupDeleted={characteristic.isSubgroupDeleted}
              />
            </CharacteristicItem>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button onClick={handleSaveProfile} disabled={!canSave} className="gap-2">
                <Plus className="w-4 h-4" />
                {tc('button.save')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-1 border-dashed p-0 w-1/2">
        <CardContent className="md:p-0 sm:p-0">
          <CardHeader className="px-0 py-1 border-none mb-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {t('result')}
            </h3>
          </CardHeader>
          <CharacteristicResult {...resultAromasData} itemName={t('selected_aromas')} />
          <CharacteristicResult {...resultFlavorsData} itemName={t('selected_flavors')} />
          <CharacteristicResult {...resultCharacteristicData} itemName={t('selected_flavors')} />
        </CardContent>
      </Card>
    </div>
  )
}
