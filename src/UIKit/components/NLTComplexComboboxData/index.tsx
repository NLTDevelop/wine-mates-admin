import * as React from 'react'
import { Check, ChevronsUpDown, X, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Popover, PopoverContent, PopoverTrigger } from '@/UIKit/shadcn/ui/popover'
import { Button } from '@/UIKit/shadcn/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/UIKit/shadcn/ui/command'
import { NLTProgress } from '../NLTProgress/nlt-progress'
import { useDebounce } from '@/hooks/ui/useDebounce'

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
}) => {
  const { t } = useTranslation('common')
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [options, setOptions] = React.useState<IOption[]>(initialOptions)
  const [allOptions, setAllOptions] = React.useState<IOption[]>(initialOptions)
  const [isLoading, setIsLoading] = React.useState(false)
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

  const handleClearSelection = () => {
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

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={newOpen => setOpen(newOpen)}>
        <PopoverTrigger asChild className="border-border">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between font-normal text-sm border bg-background ${open ? 'border-2 border-sidebar-accent' : 'border-border'}`}
            disabled={disabled}
          >
            <span className="truncate max-w-[calc(100%-1.5rem)] overflow-hidden whitespace-nowrap">
              {value?.value ? options.find(option => option.value === value.value)?.label || value.label : <span className="text-gray-400">{placeholder}</span>}
            </span>
            {value?.value && !disableClear ? (
              <X
                className="opacity-50 w-4 h-4 cursor-pointer hover:opacity-100"
                onClick={e => {
                  e.stopPropagation()
                  handleClearSelection()
                }}
              />
            ) : allowAdd ? (
              <Plus className="opacity-50 w-4 h-4" />
            ) : (
              <ChevronsUpDown className="opacity-50 w-4 h-4" />
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popper-anchor-width)] max-w-none p-0" align="start">
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
                  {t('foundNothing')}
                  {allowAdd && searchTerm && (
                    <div className="px-2 pt-2 m-auto">
                      <Button variant="ghost" type="button" className="h-5 border text-sm" onClick={handleCreateOption}>
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
