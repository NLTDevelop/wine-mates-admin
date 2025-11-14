import { useState, useEffect } from 'react'
import { WineType } from '../entities/types/wine-type'
import { /*useWineOptions,*/ useWineOptionsMock } from '../../general/presenters/useWineOptions'

interface UseWineTypeCardProps {
  wineType: WineType
  isLoading: boolean
}

export const useWineTypeCard = ({ /*wineType,*/ isLoading }: UseWineTypeCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    colors: false,
    aromas: false,
    flavorNotes: false,
    flavorCharacteristics: false,
  })
  const [isOpenAccordion, setIsOpenAccordion] = useState<boolean>(false)

  //   const { useColors, useAromas, useFlavorNotes, useFlavorCharacteristics } = useWineOptions()
  //   const { data: colorsData = [], isLoading: colorsLoading } = useColors()
  //   const { data: aromasData = [], isLoading: aromasLoading } = useAromas()
  //   const { data: flavorNotesData = [], isLoading: flavorNotesLoading } = useFlavorNotes()
  //   const { data: flavorCharacteristicsData = [], isLoading: flavorCharacteristicsLoading } = useFlavorCharacteristics()

  // --------------------для мок------------------------
  const { fetchColors } = useWineOptionsMock()

  const [optionsData, setOptionsData] = useState({
    colors: [] as any[],
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [colors] = await Promise.all([fetchColors()])

        setOptionsData({
          colors,
        })
      } catch (error) {
        console.error('Error loading wine type data:', error)
      }
    }

    loadData()
  }, [fetchColors])

  // --------------------------------------------

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
    setIsOpenAccordion(false)
  }

  const getColorLabel = (colorId: string) => {
    // return colorsData.find(color => color.value === colorId)?.label || colorId
    return optionsData.colors.find(color => color.value === colorId)?.label || colorId
  }

  const startEditing = () => setIsEditing(true)
  const cancelEditing = () => setIsEditing(false)
  const finishEditing = () => setIsEditing(false)

  // const isDataLoading = colorsLoading || aromasLoading || flavorNotesLoading || flavorCharacteristicsLoading

  return {
    isEditing,
    expandedSections,
    optionsData,
    toggleSection,
    getColorLabel,
    startEditing,
    cancelEditing,
    finishEditing,
    setIsOpenAccordion,
    isOpenAccordion,
    isLoading,
    //  isLoading: isLoading || isDataLoading
  }
}
