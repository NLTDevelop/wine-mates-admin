import { Card, CardContent, CardHeader } from '@/UIKit/shadcn/ui/card'
import { Palette, Plus } from 'lucide-react'
import { useWineProfile } from '../../presenters/useWineProfile'
import { useTranslation } from 'react-i18next'
import { useCreateWineProfile } from '../../presenters/useCreateWineProfile'
import { CreateTemplateSection, ResultSection } from '..'
import { Button } from '@/UIKit/shadcn/ui/button'
import { useCallback, useEffect } from 'react'
import { useProfileDetail } from '../../presenters/useProfileDetail'

interface CreateTemplateFormProps {
  editingProfileId: string | null
  setEditingProfileId: (id: string | null) => void
}

export const CreateTemplateForm = ({ editingProfileId, setEditingProfileId }: CreateTemplateFormProps) => {
  const { t } = useTranslation('wine_profile')

  const { types, colors, aromaGroups, flavorGroups, tasteCharacteristics, createProfile, updateProfile, isLoadingProfile } = useWineProfile()

  const {
    isExpanded,

    selectedType,
    selectedColor,
    setSelectedType,
    setSelectedColor,

    aromas,
    flavors,
    characteristic,

    canSaveProfile,
    handleSaveProfile,
    handleCancel,
    expandForm,
    initializeFormFromProfile,
    resultAromasDataGroups,
    resultFlavorsDataGroups,
    resultCharacteristicDataGroups,
    wineType,
    wineColor,
    isEditing,
    openForEditing,
  } = useCreateWineProfile({
    types,
    colors,
    aromaGroups,
    flavorGroups,
    tasteCharacteristics,
    onCreateProfile: createProfile,
    onUpdateProfile: updateProfile,
  })

  const { profile } = useProfileDetail(editingProfileId || '')

  const handleCancelWithReset = useCallback(() => {
    handleCancel()
    setEditingProfileId(null)
  }, [handleCancel, setEditingProfileId])

  const handleSaveWithReset = useCallback(() => {
    handleSaveProfile()
    setEditingProfileId(null)
  }, [handleSaveProfile, setEditingProfileId])

  useEffect(() => {
    if (editingProfileId && profile) {
      initializeFormFromProfile(profile)

      if (!isExpanded) {
        openForEditing()
      }
    }
  }, [editingProfileId, profile, isExpanded, isEditing, openForEditing])

  if (!isExpanded) {
    return (
      <div className="flex justify-between items-center flex-wrap-reverse sm:flex-nowrap gap-6">
        <h2 className="text-2xl font-bold">{t('templates')}</h2>
        <Button
          onClick={() => {
            setEditingProfileId(null)
            expandForm()
          }}
        >
          <Plus className="w-4 h-4" />
          {t('button.create_new_template')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <Card className="border border-dashed p-0 w-1/2">
        <CardContent className="md:p-0 sm:p-0">
          <CardHeader className="px-0 py-1 border-none mb-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="w-5 h-5" />
              {t('create_new_profile')}
            </h3>
          </CardHeader>

          <CreateTemplateSection
            handleSaveProfile={handleSaveWithReset}
            selectedType={selectedType}
            types={types}
            selectedColor={selectedColor}
            colors={colors}
            aromas={aromas}
            flavors={flavors}
            characteristic={characteristic}
            setSelectedType={setSelectedType}
            setSelectedColor={setSelectedColor}
            handleCancel={handleCancelWithReset}
            canSaveProfile={canSaveProfile}
            isLoadingProfile={isLoadingProfile}
            isEdit={!!editingProfileId}
          />
        </CardContent>
      </Card>

      <ResultSection
        wineType={wineType}
        wineColor={wineColor}
        resultAromasDataGroups={resultAromasDataGroups as any}
        resultFlavorsDataGroups={resultFlavorsDataGroups as any}
        resultCharacteristicDataGroups={resultCharacteristicDataGroups as any}
      />
    </div>
  )
}
