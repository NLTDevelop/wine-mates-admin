import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { useTranslation } from 'react-i18next'
import { IOption, IOptionWithColor } from '../../enteties/types/types'

interface ProfileSelectsProps {
  selectedType: string
  setSelectedType: (type: string) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
  typeNames: IOption[]
  colorNames: IOptionWithColor[]
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
              return (
                <SelectItem key={`${wt.name}_${idx}`} value={wt.id?.toString()}>
                  {wt.name}
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
              return (
                <SelectItem key={`${c.name}_${idx}`} value={c.id?.toString()}>
                  {c.name}
                </SelectItem>
              )
            })}
        </SelectContent>
      </Select>
    </div>
  )
}
