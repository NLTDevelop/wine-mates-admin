import { Button } from '@/UIKit/shadcn/ui/button'
import { CharacteristicItem, CharacteristicContent } from '..'
import { ProfileSelects } from './profile-selects'
import { useTranslation } from 'react-i18next'
import { Dispatch, SetStateAction, useState } from 'react'
import { IOption, IOptionWithColor } from '../../enteties/types/types'

interface CreateTemplateSectionProps {
  handleSaveProfile: () => void
  selectedType: string
  types: IOption[]
  selectedColor: string
  colors: IOptionWithColor[]
  aromas: any
  flavors: any
  characteristic: any
  setSelectedType: Dispatch<SetStateAction<string>>
  setSelectedColor: Dispatch<SetStateAction<string>>
  handleCancel: () => void
  canSaveProfile: boolean
  isLoadingProfile: boolean
}

export const CreateTemplateSection = ({
  handleSaveProfile,
  handleCancel,
  canSaveProfile,
  isLoadingProfile,
  selectedType,
  types,
  selectedColor,
  colors,
  aromas,
  flavors,
  characteristic,
  setSelectedType,
  setSelectedColor,
}: CreateTemplateSectionProps) => {
  const { t } = useTranslation('wine_profile')
  const { t: tc } = useTranslation('common')

  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null)

  const handleToggleAccordion = (id: string) => {
    setOpenAccordionId(prevId => (prevId === id ? null : id))
  }

  return (
    <div className="space-y-4">
      <ProfileSelects selectedType={selectedType} typeNames={types} setSelectedType={setSelectedType} selectedColor={selectedColor} colorNames={colors} setSelectedColor={setSelectedColor} />

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

      <div className="w-full flex gap-3 justify-end mt-4">
        <Button onClick={handleCancel} variant="outline">
          {tc('button.cancel')}
        </Button>
        <Button onClick={handleSaveProfile} disabled={!canSaveProfile || isLoadingProfile}>
          {isLoadingProfile ? tc('button.saving') : tc('button.save')}
        </Button>
      </div>
    </div>
  )
}
