import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { NameDictionary } from '../../../general/entities/types'
import { getDisplayNames } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface ProfileSelectsProps {
  selectedType: string
  setSelectedType: (type: string) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  typeNames: NameDictionary[][]
  colorNames: NameDictionary[][]
}

export const ProfileSelects = ({ selectedType, setSelectedType, selectedColor, setSelectedColor, typeNames, colorNames }: ProfileSelectsProps) => {
  const { t } = useTranslation('wine_profile')

  return (
    <div className="flex flex-row  gap-3">
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger>
          <SelectValue placeholder={t('type_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {typeNames.length > 0 &&
            typeNames.map((wt, idx) => {
              const { nameEn, nameUa } = getDisplayNames(wt || [])
              return (
                <SelectItem key={`${nameEn}_${idx}`} value={nameEn || nameUa}>
                  {nameEn || nameEn}
                </SelectItem>
              )
            })}
        </SelectContent>
      </Select>

      <Select value={selectedColor} onValueChange={setSelectedColor}>
        <SelectTrigger>
          <SelectValue placeholder={t('color_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {colorNames.length > 0 &&
            colorNames.map((c, idx) => {
              const { nameEn, nameUa } = getDisplayNames(c || [])
              return (
                <SelectItem key={`${nameEn}_${idx}`} value={nameEn || nameUa}>
                  {nameEn || nameUa}
                </SelectItem>
              )
            })}
        </SelectContent>
      </Select>
    </div>
  )
}
