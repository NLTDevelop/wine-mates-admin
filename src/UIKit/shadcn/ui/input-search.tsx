import { useTranslation } from 'react-i18next'
import { Input } from './input'
import { forwardRef } from 'react'

export type SearchInputProps = {
  value: string
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
  handleClear?: () => void
  placeholder?: string
  className?: string
  isLoading?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({ value, onChange, handleClear, placeholder, className, isLoading }, ref) => {
  const { t } = useTranslation('common')

  return <Input ref={ref} variant="search" value={value} onChange={e => onChange(e)} placeholder={placeholder ?? t('search')} onClear={handleClear} isLoading={isLoading} className={className} />
})
