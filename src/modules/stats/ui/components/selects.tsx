import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

interface SelectsProps {
  selectedYear: string
  setSelectedYear: Dispatch<SetStateAction<string>>
  years: number[]
  selectedGender?: 'male' | 'female' | 'all'
  setSelectedGender: (gender: 'male' | 'female' | 'all') => void
}

export const Selects = ({ selectedYear, setSelectedYear, years, selectedGender, setSelectedGender }: SelectsProps) => {
  const { t } = useTranslation('stats')

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
      <div className="flex flex-wrap gap-3">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="year_placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_years')}</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('sex_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_sexes')}</SelectItem>
            <SelectItem value="male">{t('male')}</SelectItem>
            <SelectItem value="female">{t('female')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
