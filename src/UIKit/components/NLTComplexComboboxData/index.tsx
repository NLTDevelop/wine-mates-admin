import * as React from 'react'
import { Check, ChevronsUpDown, X, Plus, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/UIKit/shadcn/ui/command'
import { NLTProgress } from '../NLTProgress/nlt-progress'
import { useDebounce } from '@/hooks/ui/useDebounce'
import { cn } from '@/lib/utils'
import { NLTTooltip } from '../NLTTooltip'

interface IOption {
  value: string
  label: string
}

interface NLTComboboxProps {
  value: IOption | null
  onChange: (value: IOption | null) => void
  placeholder?: string
  searchLabel?: string
  disabled?: boolean
  fetchOptions?: (search?: string) => Promise<IOption[]>
  itemOptions?: IOption[]
  disableClear?: boolean
  allowAdd?: boolean
  options?: IOption[]
  onCreateOption?: (data: string, id: string) => Promise<IOption | null>
  name: string
  error?: string
}
export const NLTComplexComboboxData: React.FC<NLTComboboxProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
  searchLabel,
  options: initialOptions = [],
  disableClear = false,
  allowAdd,
  onCreateOption,
  name,
  error,
}) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [options, setOptions] = React.useState<IOption[]>(initialOptions)
  const [allOptions, setAllOptions] = React.useState<IOption[]>(initialOptions)
  const [isLoading, setIsLoading] = React.useState(false)
  const [popoverSide, setPopoverSide] = React.useState<'bottom' | 'top'>('bottom')

  React.useEffect(() => {
    if (!searchTerm) {
      setOptions(allOptions)
    } else {
      setOptions(allOptions.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase())))
    }
  }, [searchTerm, allOptions])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setIsLoading(true)
    debouncedWrapper(value)
  }

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
  }

  const handleSearch = React.useCallback(
    (term: string) => {
      if (!term) {
        setOptions(allOptions)
      } else {
        setOptions(allOptions.filter(opt => opt.label.toLowerCase().includes(term.toLowerCase())))
      }
      setIsLoading(false)
    },
    [allOptions]
  )
  const { debouncedWrapper } = useDebounce(handleSearch, 1000)

  const handleCreateOption = async () => {
    if (!onCreateOption) return

    const created = await onCreateOption(searchTerm, name)
    if (!created) return

    const option: IOption = {
      value: String(created.value),
      label: created.label,
    }

    setAllOptions(prev => [...prev, option])
    setOptions(prev => [...prev, option])

    onChange(option)
    setSearchTerm('')
    setOpen(false)
  }

  React.useEffect(() => {
    setAllOptions(initialOptions)
    setOptions(initialOptions)
  }, [initialOptions])

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      const trigger = document.getElementById(`combobox-trigger-${name}`)
      if (trigger) {
        const rect = trigger.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top

        if (spaceBelow < 250 && spaceAbove > 250) {
          setPopoverSide('top')
        } else {
          setPopoverSide('bottom')
        }
      }
    }
    setOpen(newOpen)
  }

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild className="border-border px-1">
          <Button
            id={`combobox-trigger-${name}`}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('w-full justify-between font-normal text-sm border bg-background', open && 'border-2 border-sidebar-accent', !open && 'border-border')}
            disabled={disabled}
          >
            <span className={cn('truncate max-w-[calc(100%-1.5rem)] overflow-hidden whitespace-nowrap')}>
              {value?.value ? options.find(option => option.value === value.value)?.label || value.label : <span className="text-gray-400">{placeholder}</span>}
            </span>
            {value?.value && !disableClear ? (
              <div className="rounded-sm hover:bg-accent transition-colors" onClick={handleClearSelection}>
                <X className="w-3 h-3 opacity-50 hover:opacity-100" />
              </div>
            ) : allowAdd ? (
              <Plus className="opacity-50 w-4 h-4" />
            ) : (
              <ChevronsUpDown className="opacity-50 w-4 h-4" />
            )}
          </Button>
        </PopoverTrigger>
        {error && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <NLTTooltip delay={500} message={error as string} className="bg-red-500 max-w-[300px]" trigger={<AlertCircle className="h-4 w-4 text-red-400" />} />
          </div>
        )}

        <PopoverContent className="w-[var(--radix-popper-anchor-width)] max-w-none p-0" align="start" side={popoverSide}>
          <Command shouldFilter={false}>
            <CommandInput placeholder={searchLabel || 'Пошук'} value={searchTerm} onValueChange={handleSearchChange} />
            <CommandList>
              {isLoading && (
                <div className="flex justify-center py-4">
                  <NLTProgress size="sm" />
                </div>
              )}

              {!isLoading && options.length === 0 && (
                <CommandEmpty>
                  {t('found_nothing')}
                  {allowAdd && searchTerm && (
                    <div className="px-2 pt-2 m-auto">
                      <Button variant="secondary" type="button" className="h-5 border text-sm py-3" onClick={handleCreateOption}>
                        <Plus className="h-4 w-4 mr-1" />
                        {t('button.add')}
                      </Button>
                    </div>
                  )}
                </CommandEmpty>
              )}

              {!isLoading && (
                <CommandGroup>
                  {options.map((option, index) => (
                    <CommandItem
                      key={option.value + index}
                      value={String(option.value)}
                      onSelect={() => {
                        onChange(option)
                        setOpen(false)
                      }}
                    >
                      {option.label}
                      <Check className={`ml-auto ${value?.value === option.value ? 'opacity-100' : 'opacity-0'}`} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
