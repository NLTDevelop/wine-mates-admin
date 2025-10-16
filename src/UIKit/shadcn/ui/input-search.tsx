import { useTranslation } from 'react-i18next'
import { Input } from './input'

export type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  handleClear?: () => void
  placeholder?: string
  className?: string
  isLoading?: boolean
}

export const SearchInput = ({
  value,
  onChange,
  className,
  isLoading,
  handleClear,
  placeholder,
}: SearchInputProps) => {
  const { t } = useTranslation('common')
  return (
    <Input
      variant="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder ?? t('search')}
      onClear={handleClear}
      isLoading={isLoading}
      className={className}
    />
  )
}
