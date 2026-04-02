import { useCallback, useMemo, useRef, useState } from 'react'
import { CreateWineProfileRequest, ISubgroup, IWineProfileDetail, UpdateWineProfileParams } from '../enteties/types/types'
import { useGroupManagement } from './useGroupManagement'
import { mapProfileToGroups, mapResultDataToGroups, mapServerImageToLocal } from './wineProfileAdapters'
import { defaultImages, useProfileStore } from '../enteties/profile-store'
import { useImageFile } from './useImageFile'

interface UseCreateWineProfileProps {
  types: any[]
  colors: any[]
  aromaGroups: any[]
  flavorGroups: any[]
  tasteCharacteristics: any[]
  onCreateProfile: (data: CreateWineProfileRequest) => void
  onUpdateProfile: (params: UpdateWineProfileParams) => void
  isLoading?: boolean
}

export const useCreateWineProfile = ({ types, colors, aromaGroups, flavorGroups, tasteCharacteristics, onCreateProfile, onUpdateProfile }: UseCreateWineProfileProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null)

  const [selectedType, setSelectedType] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  const { selectedImage, setSelectedImage, resetSelectedImage } = useProfileStore()
  const { getImageFile } = useImageFile()

  const baseAromaGroups = useMemo(() => structuredClone(aromaGroups), [aromaGroups])

  const baseFlavorGroups = flavorGroups.map(group => {
    const subgroup = group.subgroups[0]
    if (!subgroup) return group

    return {
      ...group,
      subgroups: subgroup.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        colorHex: item.colorHex,
        items: [''],
        selectedItems: [item.id],
      })),
    }
  })

  const baseTasteGroups = useMemo(() => structuredClone(tasteCharacteristics), [tasteCharacteristics])

  const aromas = useGroupManagement({ initialGroups: baseAromaGroups })

  const flavors = useGroupManagement({ initialGroups: baseFlavorGroups })

  const characteristic = useGroupManagement({ initialGroups: baseTasteGroups })

  const originalRef = useRef<{
    selectedType: string
    selectedColor: string
    aromas: any
    flavors: any
    characteristics: any
  } | null>(null)

  const getDisplayName = useCallback((id: string, items: any[]) => {
    if (!id) return ''
    const item = items.find(i => i.id?.toString() === id)
    return item?.translations?.[0]?.name || item?.name || id
  }, [])

  const wineType = useMemo(() => getDisplayName(selectedType, types), [selectedType, types, getDisplayName])

  const wineColor = useMemo(() => getDisplayName(selectedColor, colors), [selectedColor, colors, getDisplayName])

  const resultAromasDataGroups = useMemo(() => mapResultDataToGroups(aromas.getResultData()), [aromas])

  const resultFlavorsDataGroups = useMemo(() => mapResultDataToGroups(flavors.getResultData()), [flavors])

  const resultCharacteristicDataGroups = useMemo(() => mapResultDataToGroups(characteristic.getResultData()), [characteristic])

  const canSaveProfile = Boolean(selectedType && selectedColor)

  const buildProfileData = useCallback(async (): Promise<CreateWineProfileRequest> => {
    const selectedAromas = aromas.groups
      .filter(g => !aromas.isGroupDeleted(g.id))
      .map(g => ({
        aromaGroupId: g.id,
        aromaSubgroups: g.subgroups
          .filter((s: any) => !aromas.isSubgroupDeleted(g.id, s.id))
          .map((s: any) => ({
            aromaSubgroupId: s.id,
            aromas: s.selectedItems.filter((id: number | string): id is number | string => id != null).map((id: number | string) => Number(id)),
          })),
      }))

      .filter(g => g.aromaSubgroups.length > 0)

    const selectedFlavors = flavors.groups
      .filter(g => !flavors.isGroupDeleted(g.id))
      .map(g => ({
        flavorGroupId: g.id,
        flavors: g.subgroups.filter((s: any) => !flavors.isSubgroupDeleted(g.id, s.id)).map((f: any) => f.id),
      }))
      .filter(g => g.flavors.length > 0)

    const selectedTasteCharacteristics = characteristic.groups.filter(ch => !characteristic.isGroupDeleted(ch.id)).map(ch => Number(ch.id))

    let imageFile: File
    try {
      imageFile = await getImageFile(selectedImage)
    } catch (error) {
      imageFile = await getImageFile(defaultImages[0])
    }

    return {
      typeId: Number(selectedType),
      colorId: Number(selectedColor),
      selectedAromas,
      selectedFlavors,
      selectedTasteCharacteristics,
      image: imageFile,
    }
  }, [aromas, flavors, characteristic, selectedType, selectedColor])

  const resetForm = useCallback((_?: { type?: string; color?: string }) => {
    setSelectedType('')
    setSelectedColor('')
    resetSelectedImage()

    aromas.initializeFromData(mapProfileToGroups(aromaGroups, [], 'aroma'))
    flavors.initializeFromData(mapProfileToGroups(flavorGroups, [], 'flavor'))
    characteristic.reset()

    setIsEditing(false)
    setEditingProfileId(null)
  }, [])

  const resetGroupsOnly = useCallback(() => {
    aromas.reset()
    flavors.reset()
    characteristic.reset()
    resetSelectedImage()
  }, [flavorGroups])

  const expandForm = () => {
    aromas.initializeFromData(mapProfileToGroups(aromaGroups, [], 'aroma'))
    flavors.resetAll()
    characteristic.resetAll()

    aromas.setDeletedGroups([])
    aromas.setDeletedSubgroups([])

    flavors.setDeletedGroups([])
    flavors.setDeletedSubgroups([])

    characteristic.setDeletedGroups([])

    setSelectedType('')
    setSelectedColor('')

    setIsExpanded(true)
    setIsEditing(false)
  }

  const handleCancel = () => {
    aromas.initializeFromData(mapProfileToGroups(aromaGroups, [], 'aroma'))
    flavors.initializeFromData(mapProfileToGroups(flavorGroups, [], 'flavor'))
    characteristic.initializeFromData(mapProfileToGroups(tasteCharacteristics, [], 'characteristic'))
    resetSelectedImage()
    if (isEditing) {
      setIsExpanded(false)
      setIsEditing(false)
    } else {
      resetForm()
      setIsExpanded(false)
    }
  }

  const closeEditMode = () => {
    setIsEditing(false)
    setIsExpanded(false)
    setEditingProfileId(null)
    originalRef.current = null
    resetSelectedImage()
  }

  const handleSaveProfile = async () => {
    const payload = await buildProfileData()

    if (isEditing && editingProfileId) {
      onUpdateProfile({ profileId: editingProfileId, newProfile: payload })
      closeEditMode()
    } else {
      onCreateProfile(payload)
      resetForm({
        type: types[0]?.id.toString() ?? '',
        color: colors[0]?.id.toString() ?? '',
      })
      setIsExpanded(false)
    }
  }

  const initializeDeletedFlagsFromProfile = (profile: IWineProfileDetail) => {
    const deletedAromaGroups: number[] = []
    const deletedAromaSubgroups: string[] = []

    aromas.groups.forEach(group => {
      const profileGroup = profile.selectedAromas.find(g => g.id === group.id)
      if (!profileGroup) {
        deletedAromaGroups.push(group.id)
      } else {
        group.subgroups.forEach((sub: ISubgroup) => {
          const profileSub = profileGroup.subgroups.find(s => s.id === sub.id)
          if (!profileSub) deletedAromaSubgroups.push(`${group.id}-${sub.id}`)
        })
      }
    })

    const deletedFlavorGroups: number[] = []
    const deletedFlavorSubgroups: string[] = []

    flavors.groups.forEach(group => {
      const profileGroup = profile.selectedFlavors.find(g => g.id === group.id)
      if (!profileGroup) {
        deletedFlavorGroups.push(group.id)
      } else {
        group.subgroups.forEach((sub: ISubgroup) => {
          const profileSub = profileGroup.flavors.find(s => s.id === sub.id)
          if (!profileSub) deletedFlavorSubgroups.push(`${group.id}-${sub.id}`)
        })
      }
    })

    const deletedCharacteristicGroups = characteristic.groups.filter(char => !profile.selectedTasteCharacteristics.some(selected => selected.id === char.id)).map(char => char.id)

    aromas.setDeletedGroups(deletedAromaGroups)
    aromas.setDeletedSubgroups(deletedAromaSubgroups)

    flavors.setDeletedGroups(deletedFlavorGroups)
    flavors.setDeletedSubgroups(deletedFlavorSubgroups)

    characteristic.setDeletedGroups(deletedCharacteristicGroups)
  }

  const initializeFormFromProfile = (profile: IWineProfileDetail) => {
    setSelectedType(profile.type?.id?.toString() ?? '')
    setSelectedColor(profile.color?.id?.toString() ?? '')

    if (profile.image) {
      const localImage = mapServerImageToLocal(profile.image)
      if (localImage) {
        setSelectedImage(localImage)
      } else {
        resetSelectedImage()
      }
    } else {
      resetSelectedImage()
    }

    aromas.initializeFromData(mapProfileToGroups(aromaGroups, profile.selectedAromas, 'aroma'))
    flavors.initializeFromData(mapProfileToGroups(flavorGroups, profile.selectedFlavors, 'flavor'))
    characteristic.initializeFromData(mapProfileToGroups(tasteCharacteristics, profile.selectedTasteCharacteristics, 'characteristic'))

    initializeDeletedFlagsFromProfile(profile)

    setIsEditing(true)
    setIsExpanded(true)
    setEditingProfileId(profile.id)
  }

  const openForEditing = useCallback(() => {
    setIsExpanded(true)
    setIsEditing(true)
  }, [])

  return {
    isExpanded,
    isEditing,

    selectedType,
    selectedColor,
    setSelectedType,
    setSelectedColor,

    aromas,
    flavors,
    characteristic,

    wineType,
    wineColor,
    resultAromasDataGroups,
    resultFlavorsDataGroups,
    resultCharacteristicDataGroups,

    canSaveProfile,

    expandForm,
    handleCancel,
    handleSaveProfile,
    initializeFormFromProfile,
    resetGroupsOnly,
    openForEditing,
  }
}
