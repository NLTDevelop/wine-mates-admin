import { useCallback } from 'react'
import { IWines } from '../entities/types/types'
import { IOption } from '@/UIKit/components/NLTFormCombobox'

interface UniqueValues {
  names: IOption[]
  vintages: IOption[]
  countries: IOption[]
  regions: IOption[]
  producers: IOption[]
  grapeVarieties: IOption[]
  types: IOption[]
  colors: IOption[]
  images: IOption[]
}

export interface SelectionInfo {
  selectedIds: string[]
  selectedWines: IWines[]
  uniqueValues: UniqueValues
}

interface UseWineSelectionReturn {
  getUniqueValuesFromWines: (wines: IWines[]) => UniqueValues
  getSelectionInfo: (wines: IWines[]) => SelectionInfo
  mapToOptions: <T>(items: T[], getLabel: (item: T) => string, getValue: (item: T) => string | number) => IOption[]
  getOptionByValue: (options: IOption[], value: string | number | null) => IOption | null
  getFieldOptions: (uniqueValues: UniqueValues, field: keyof UniqueValues) => IOption[]
}

export const useWineSelection = (): UseWineSelectionReturn => {
  const hasImage = (wine: IWines): wine is IWines & { image: NonNullable<IWines['image']> } => {
    return wine.image !== null && wine.image !== undefined
  }

  const mapToOptions = useCallback(<T>(items: T[], getLabel: (item: T) => string, getValue: (item: T) => string | number): IOption[] => {
    return items.map(item => ({
      value: String(getValue(item)),
      label: getLabel(item),
    }))
  }, [])

  const getOptionByValue = useCallback((options: IOption[], value: string | number | null): IOption | null => {
    if (!value || !options.length) return null
    const stringValue = String(value)
    return options.find(opt => opt.value === stringValue) || null
  }, [])

  const getFieldOptions = useCallback((uniqueValues: UniqueValues, field: keyof UniqueValues): IOption[] => {
    return uniqueValues[field] || []
  }, [])

  const getUniqueValuesFromWines = useCallback((wines: IWines[]): UniqueValues => {
    return {
      names: [...new Set(wines.map(w => w.name).filter(Boolean))].map(name => ({
        value: String(name),
        label: String(name),
      })),

      vintages: [...new Set(wines.map(w => w.vintage).filter((v): v is number => v !== null && v !== undefined))].map(vintage => ({
        value: String(vintage),
        label: String(vintage),
      })),

      countries: [...new Map(wines.filter(w => w.country?.id && w.country?.name).map(w => [w.country!.id, w.country!])).values()].map(country => ({
        value: String(country.id),
        label: String(country.name),
      })),

      regions: [...new Map(wines.filter(w => w.region?.id && w.region?.name).map(w => [w.region!.id, w.region!])).values()].map(region => ({
        value: String(region.id),
        label: String(region.name),
      })),

      producers: [...new Set(wines.map(w => w.producer).filter(Boolean))].map(producer => ({
        value: String(producer),
        label: String(producer),
      })),

      grapeVarieties: [...new Set(wines.map(w => w.grapeVariety).filter(Boolean))].map(variety => ({
        value: String(variety),
        label: String(variety),
      })),

      types: [...new Map(wines.filter(w => w.type?.id && w.type?.name).map(w => [w.type!.id, w.type!])).values()].map(type => ({
        value: String(type.id),
        label: String(type.name),
      })),

      colors: [...new Map(wines.filter(w => w.color?.id && w.color?.name).map(w => [w.color!.id, w.color!])).values()].map(color => ({
        value: String(color.id),
        label: String(color.name),
      })),

      images: wines
        .filter(hasImage)
        .map(wine => ({
          value: wine.image!.smallUrl || wine.image!.mediumUrl || wine.image!.originalUrl,
          label: wine.image!.name || 'Image',
          imageData: wine.image,
        }))
        .filter((img, index, self) => index === self.findIndex(i => i.value === img.value)),
    }
  }, [])

  const getSelectionInfo = useCallback(
    (wines: IWines[]): SelectionInfo => {
      return {
        selectedIds: wines.map(w => w.id).filter((id): id is string => id !== undefined),
        selectedWines: wines,
        uniqueValues: getUniqueValuesFromWines(wines),
      }
    },
    [getUniqueValuesFromWines]
  )

  return {
    getUniqueValuesFromWines,
    getSelectionInfo,
    mapToOptions,
    getOptionByValue,
    getFieldOptions,
  }
}
