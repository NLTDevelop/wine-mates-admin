import * as React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '@/UIKit/shadcn/ui/popover'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/UIKit/shadcn/ui/command'
import { AlertCircle, Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

import { useDebounce } from '@/hooks/ui/useDebounce'
import { NLTProgress } from '../components/NLTProgress/nlt-progress'
import { NLTTooltip } from '../components/NLTTooltip'

interface IOption {
  value: string
  label: string
}

interface FormComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchLabel?: string
  disabled?: boolean
  fetchOptions: (search?: string) => Promise<IOption[]>
  itemOptions?: IOption[]
  error?: string
  onBlur?: () => void
}

export const FormCombobox: React.FC<FormComboboxProps> = ({ value, onChange, placeholder, disabled, searchLabel, fetchOptions, itemOptions, error, onBlur }) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [options, setOptions] = React.useState<IOption[]>(itemOptions || [])
  const [loading, setLoading] = React.useState(false)

  const getData = async (search?: string) => {
    if (disabled) return

    setLoading(true)
    try {
      const fetchedOptions = await fetchOptions(search)
      setOptions(fetchedOptions)
    } catch (error) {
      console.error('Ошибка при загрузке опций:', error)
    } finally {
      setLoading(false)
    }
  }

  const { debouncedWrapper } = useDebounce(getData, 500)

  const handleSearchChange = (searchValue: string) => {
    if (disabled) return
    setSearchTerm(searchValue)
    debouncedWrapper(searchValue)
  }

  React.useEffect(() => {
    if (open && !disabled) {
      getData()
      setSearchTerm('')
    }
  }, [open, disabled])

  const selectedLabel = options.find(option => option.value === value)?.label

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  const handleSelectOption = (optionValue: string) => {
    if (disabled) return

    if (value === optionValue) {
      onChange('')
    } else {
      onChange(optionValue)
    }
    setOpen(false)
  }

  const handleBlur = () => {
    onBlur?.()
  }

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className={cn(
            'h-11 w-full border px-3 text-base shadow-sm transition-colors rounded-md placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-background text-foreground border-input'
          )}
        >
          <Button onBlur={handleBlur} variant="outline" role="combobox" aria-expanded={open} className={cn('w-full justify-between', disabled && 'opacity-50 cursor-not-allowed')} disabled={disabled}>
            <span className={cn('text-sm truncate flex-1 overflow-hidden whitespace-nowrap text-left', !value && 'text-muted-foreground')}>{selectedLabel || placeholder}</span>

            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {value && !disabled ? (
                <>
                  <div className="rounded-sm hover:bg-accent transition-colors" onClick={handleClearSelection}>
                    <X className="w-3 h-3 opacity-50 hover:opacity-100" />
                  </div>
                </>
              ) : (
                <>
                  <ChevronsUpDown className="w-4 h-4 opacity-50" />
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>

        {error && (
          <div className="absolute right-7.5 top-1/2 transform -translate-y-1/2">
            <NLTTooltip delay={500} message={error} className="bg-red-500 max-w-[300px]" trigger={<AlertCircle className="h-4 w-4 text-red-400" />} />
          </div>
        )}

        <PopoverContent className="w-[var(--radix-popper-anchor-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder={searchLabel} value={searchTerm} onValueChange={handleSearchChange} />
            <CommandList>
              <CommandEmpty>{t('foundNothing')}</CommandEmpty>
              <CommandGroup>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <NLTProgress className="w-6 h-6" />
                  </div>
                ) : (
                  options.map(option => (
                    <CommandItem key={option.value} value={option.value} onSelect={() => handleSelectOption(option.value)}>
                      {option.label}
                      <Check className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
