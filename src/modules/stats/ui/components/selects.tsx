import { cn } from '@/lib/utils'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/UIKit/shadcn/ui/select'
import { useTranslation } from 'react-i18next'

interface SelectsProps {
  selectedYear: string
  setSelectedYear: (year: string) => void
  years: number[]
  selectedGender?: 'male' | 'female' | 'all'
  setSelectedGender: (gender: 'male' | 'female' | 'all') => void
  resetFilters?: () => void
}

export const Selects = ({ selectedYear, setSelectedYear, years, selectedGender, setSelectedGender, resetFilters }: SelectsProps) => {
  const { t } = useTranslation('stats')

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-6">
      <div className="flex flex-wrap gap-3">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className={cn('w-[180px]', selectedYear !== 'all' && 'text-primary font-bold')}>
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
          <SelectTrigger className={cn('w-[180px]', selectedGender !== 'all' && 'text-primary font-bold')}>
            <SelectValue placeholder={t('sex_placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('all_sexes')}</SelectItem>
            <SelectItem value="male">{t('male')}</SelectItem>
            <SelectItem value="female">{t('female')}</SelectItem>
          </SelectContent>
        </Select>

        <Button variant={'secondary'} disabled={selectedGender === 'all' && selectedYear === 'all'} onClick={resetFilters} className="h-9">
          {t('reset_filters')}
        </Button>
      </div>
    </div>
  )
}
